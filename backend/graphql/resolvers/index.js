const Profile = require("../../models/Profile")

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
    try {
      const { email, default_currency } = args.profile
      const profileFetched = await Profile.findOne({email:email});
      console.log("profileFetched: "+profileFetched+ ","+default_currency);
      if(profileFetched){
        //Update if profile already exists
        const updatedProf = await Profile.findOneAndUpdate({_id : profileFetched._id},
            { $set: {defaultCurrency: default_currency} },
            { new: true}
            );
        // Profile.findByIdAndUpdate(
        //     { _id:profileFetched[0]._id }, 
        //     { $set: default_currency },
        //     { new: true }
        // )
        // .then(profile => res.json(profile) ); 
        console.log("Updated prof "+ JSON.stringify(updatedProf));     
    }
    } catch (error) {
      throw error
    }
  },
}