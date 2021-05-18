const Profile = require("../../models/Profile")
const {performance} = require('perf_hooks');

module.exports = {
    profile: async args => {
    try {
      //const { email } = args.profile
      const profileFetched = await Profile.find()
      return profileFetched.map(profile => {
        return {
          ...profile.username,
        }
      })
    } catch (error) {
      throw error
    }
  },

  updateDefaultCurrency: async args => {
    var t0 = performance.now();
    try {
      const { email, defaultCurrency } = args.profile
      const profileFetched = await Profile.findOne({email:email});
      console.log("profileFetched: "+profileFetched+ ","+defaultCurrency);
      if(profileFetched){
        //Update if profile already exists
        const updatedProf = await Profile.findOneAndUpdate({_id : profileFetched._id},
            { $set: {defaultCurrency: defaultCurrency} },
            { new: true}
            );
        // Profile.findByIdAndUpdate(
        //     { _id:profileFetched[0]._id }, 
        //     { $set: default_currency },
        //     { new: true }
        // )
        // .then(profile => res.json(profile) ); 
        console.log("Updated prof "+ JSON.stringify(updatedProf)); 
         var t1 = performance.now();
         console.log("Call to updateDefaultCurrency() API took " + (t1 - t0) + " milliseconds.")        
        return {email: updatedProf.email, defaultCurrency: updatedProf.defaultCurrency}
    }
    } catch (error) {
      throw error
    }
  },

  getProfile: async args => {
    try{
      const { email } = args.profile
      const profileFetched = await Profile.findOne({email:email});
      console.log("profileFetched: "+profileFetched);
      return {...profileFetched._doc}
    }catch(error){
      throw error
    }
  },

  getGroup: async args => {
    try{
      const { email } = args.profile
      const groupFetched = await Group.find({"members":{$elemMatch:{email: email, isProcessed:"N", isAccepted:"N"}}},{adminId: 1, groupName:1, 'members.$':1})
      console.log("groupFetched: "+groupFetched);
      return {...groupFetched._doc}
    }catch(error){
      throw error
    }
  },

  createGroup: async args =>{
    try{
      console.log(args)
      const input  = args.group
      const owner = await User.findOne({email: input.ownerId});
      console.log(owner)
      const groupFields = {};
      groupFields.groupName = input.groupName;
      groupFields.adminId = owner._id;
      groupFields.members = [];
      console.log('groupfields before: '+JSON.stringify(groupFields));
      for( var i=0; i<input.emails.length ; i++){
        console.log(input.emails[i])
        var value = await User.findOne({email: input.emails[i]});
        console.log("value "+ JSON.stringify(value))
        if(value!==null){
          var user = {};
          if(String(value._id) === String(owner._id)){
              user.isProcessed = 'Y';
              user.isAccepted = 'Y';
          }else{
              user.isProcessed = 'N';
              user.isAccepted = 'N';
          }
          user.member = value._id;
          console.log(JSON.stringify(user));
          groupFields.members.push(user);
          
        }
      }
      console.log(groupFields);
      console.log('groupfields: '+JSON.stringify(groupFields));
      return new Group(groupFields).save();

    }catch(error){
      throw error
    }
  },

  acceptInviteGroup: async args => {
    try{
     const input = args.group;
     console.log(input);
     const user = await User.findOne({email: input.member});
     console.log(user)
     const group = await Group.findOneAndUpdate({groupName: input.groupName, 'members.member': user._id},
       {$set: {"members.$.isProcessed" : "Y", "members.$.isAccepted" : "Y"}},
       {new: true}
       )
      console.log(JSON.stringify(group));
     return {...group._doc}

    }catch(error){
      throw error
    }
  },

  addBill: async args => {
    try{
      const input = args.group;
     console.log(input);
     const user = await User.findOne({email: input.member});
      var group = await Group.findOne({groupName: input.groupName});
        var members  = group.members;
        console.log("group "+group); 
        console.log("members "+JSON.stringify(members));  
        const billTransactionsFields = {};
        billTransactionsFields.authorId = user._id;
        billTransactionsFields.groupName = input.groupName;
        billTransactionsFields.expenseDesc = input.expenseName;
        billTransactionsFields.expense = input.expense;
        billTransactionsFields.members = [];
        var credit = input.expense/group.members.length;
        console.log("Credit value : "+credit);
        console.log("userid "+ user._id);
        for(var i=0;i<members.length;i++){
            var userVal = {};
            console.log("member "+members[i].member);
            console.log("user._id === members[i].member "+ user._id === members[i].member);
            if(String(user._id) === String(members[i].member)){

            }else{
                console.log(user._id);
                userVal.credit = credit;
                userVal.member = members[i].member;
                billTransactionsFields.members.push(userVal);
            }
        }
        console.log('billTransactionsFields :'+JSON.stringify(billTransactionsFields));
        const billTxns =  await new BillTransactions(billTransactionsFields).save();
        return {...billTxns._doc}; 
    }catch(error){
      throw error
    }
  }

}