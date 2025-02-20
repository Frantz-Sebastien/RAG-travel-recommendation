import { useState } from 'react'
import axios from "axios"

//UPDATED line 5
const UserProfileForm = ({ setUserId, onEmbeddingGenerated }) => {
    const [formData, setFormData] = useState({
        age: "", //Int
        gender: "", //String Select
        income: "", //Int
        education_level: "", //String Select
        travel_frequency:"", //Int
        preferred_activities:"", //String Select
        vacation_budget:"", //Int
        location:"", //String Select
        proximity_to_mountains:"", //Int Random number generated
        proximity_to_beaches: "", //Int Random number generated
        favorite_season:"", //String Select
        pets:"", //Boolean ~ Int
        environmental_concerns:"", //Boolean ~ Int
        preference:"" //Boolean ~ Int

    })

    const handleFormChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()
        const fullFormData = {
            ...formData,
            pets: formData.pets === "yes" ? 1: 0, //in the Database, pets column datatype is integer
            environmental_concerns: formData.environmental_concerns === "yes" ? 1: 0, //in the Database, environmental_concerns column datatype is integer
            preference: formData.preference === "mountains" ? 1: 0, //in the Database, preference column datatype is integer
            proximity_to_mountains: Math.floor(Math.random() * 300), //random number between 0 and 300. for testing purposes only
            proximity_to_beaches: Math.floor(Math.random() * 300), //random number between 0 and 300. for testing purposes only
        }
        console.log("Submitted:", fullFormData) //for debugging purpose

        try{
            const response = await axios.post("http://localhost:4000/users/create", fullFormData)
            const userId = response.data.userId
            console.log(`This is the id that SQL created for us: ${userId}`)
            setUserId(userId) //added this line also, UPDATED

            alert(`✅ Profile successfully created! User ID: ${userId}`);

            await onEmbeddingGenerated(userId)
            
            //Send text input to generate embedding
            if(formData.text){
                await axios.post("http://localhost:4000/embeddings/generate-embedding",{
                    userId,
                    text: formData.text
                })
                alert("✅ Embedding successfully generated!");
            }
        } catch(error){
            console.error("❌ Error submitting form:", error)
            alert("❌ Failed to submit form. Please try again.")
        }
    }

  return (
    <form onSubmit={handleFormSubmit}>
        <input type="number" name="age" placeholder="Age" onChange={handleFormChange}/>

        <select name="gender" onChange={handleFormChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-Binary</option>
        </select>

        <input type="number" name="income" placeholder='Income' onChange={handleFormChange}/>

        <select name="education_level" onChange={handleFormChange}>
            <option value="">Select Education Level</option>
            <option value="high school">High School</option>
            <option value="bachelor">Bachelor</option>
            <option value="master">Master</option>
            <option value="doctorate">Doctorate</option>
        </select>

        <input type="number" name="travel_frequency" placeholder='Travel Frequency' onChange={handleFormChange}/>

        <select name="preferred_activities" onChange={handleFormChange}>
            <option value="">Select Preferred Activity</option>
            <option value="skiing">Skiing</option>
            <option value="swimming">Swimming</option>
            <option value="hiking">Hiking</option>
            <option value="sunbathing">Sunbathing</option>
        </select>

        <input type="number" name="vacation_budget" placeholder='Vacation Budget' onChange={handleFormChange}/>

        <select name="location" onChange={handleFormChange}>
            <option value="">Select Location Type</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
        </select>

        <select name="favorite_season" onChange={handleFormChange}>
            <option value="">Select Favorite Season</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
            <option value="summer">Summer</option>
            <option value="fall">Fall</option>
        </select>

        <select name="pets" onChange={handleFormChange}>
            <option value="">Do you own Pets?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>

        <select name="environmental_concerns" onChange={handleFormChange}>
            <option value="">Do you have Environmental Concerns?</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
        </select>

        <select name="preference" onChange={handleFormChange}>
            <option value="">Do you have a Preference?</option>
            <option value="yes">Mountains</option>
            <option value="no">Beaches</option>
        </select>

        <textarea
            name="text"
            placeholder='Describe your ideal travel experience...'
            onChange={handleFormChange}
            rows="4"
            cols="50" 
        />

        <button type="submit">Submit</button>
    </form>

  )
}

export default UserProfileForm

