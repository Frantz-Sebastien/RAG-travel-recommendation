import { useState } from 'react'
import axios from "axios"

const API_URL =
    import.meta.env.MODE === "development" 
        ?  import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_BACKEND_URL_PROD; 

//UPDATED line 5
const UserProfileForm = ({ setUserId, onEmbeddingGenerated, setText }) => {
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
        setText(fullFormData.text)

        try{
            const response = await axios.post(`${API_URL}/users/create`, fullFormData)
            const userId = response.data.userId
            console.log(`This is the id that SQL created for us: ${userId}`)
            setUserId(userId) //added this line also, UPDATED

            alert(`✅ Profile successfully created! User ID: ${userId}`);

            await onEmbeddingGenerated(userId)
            
            //Send text input to generate embedding
            if(formData.text){
                await axios.post(`${API_URL}/embeddings/generate-embedding`,{
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
    <div className="container py-4">
    <div className="row justify-content-center">
        <div className="col-md-8">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Travel Profile</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleFormSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Age</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="age" 
                                    placeholder="Enter your age" 
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Gender</label>
                                <select 
                                    className="form-select" 
                                    name="gender" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="non-binary">Non-Binary</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Annual Income</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="income" 
                                    placeholder="Enter your income" 
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Education Level</label>
                                <select 
                                    className="form-select" 
                                    name="education_level" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select Education Level</option>
                                    <option value="high school">High School</option>
                                    <option value="bachelor">Bachelor</option>
                                    <option value="master">Master</option>
                                    <option value="doctorate">Doctorate</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Travel Frequency (trips per year)</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="travel_frequency" 
                                    placeholder="Number of trips per year" 
                                    onChange={handleFormChange}
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Vacation Budget</label>
                                <input 
                                    type="number" 
                                    className="form-control" 
                                    name="vacation_budget" 
                                    placeholder="Enter your budget" 
                                    onChange={handleFormChange}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Preferred Activities</label>
                            <div className="d-flex gap-3">
                                {["Sunbathing", "Hiking", "Swimming", "Skiing"].map((activity) => {
                                    const lowerCaseActivity = activity.toLowerCase();
                                    return (
                                        <div className="form-check" key={lowerCaseActivity}>
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="preferred_activities"
                                                value={lowerCaseActivity}
                                                checked={formData.preferred_activities === lowerCaseActivity}
                                                onChange={handleFormChange}
                                                id={`activity-${lowerCaseActivity}`}
                                            />
                                            <label className="form-check-label" htmlFor={`activity-${lowerCaseActivity}`}>
                                                {activity}
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Current Location</label>
                                <select 
                                    className="form-select" 
                                    name="location" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select Location Type</option>
                                    <option value="urban">Urban</option>
                                    <option value="suburban">Suburban</option>
                                    <option value="rural">Rural</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Favorite Season</label>
                                <select 
                                    className="form-select" 
                                    name="favorite_season" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select Favorite Season</option>
                                    <option value="winter">Winter</option>
                                    <option value="spring">Spring</option>
                                    <option value="summer">Summer</option>
                                    <option value="fall">Fall</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Do you have pets?</label>
                                <select 
                                    className="form-select" 
                                    name="pets" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Environmental Concerns?</label>
                                <select 
                                    className="form-select" 
                                    name="environmental_concerns" 
                                    onChange={handleFormChange}
                                >
                                    <option value="">Select an option</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Location Preference</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="preference"
                                        value="mountains"
                                        checked={formData.preference === "mountains"}
                                        onChange={handleFormChange}
                                        id="pref-mountains"
                                    />
                                    <label className="form-check-label" htmlFor="pref-mountains">
                                        Mountains
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="preference"
                                        value="beaches"
                                        checked={formData.preference === "beaches"}
                                        onChange={handleFormChange}
                                        id="pref-beaches"
                                    />
                                    <label className="form-check-label" htmlFor="pref-beaches">
                                        Beaches
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Describe your ideal travel experience</label>
                            <textarea
                                className="form-control"
                                name="text"
                                placeholder="Tell us about your perfect vacation..."
                                onChange={handleFormChange}
                                rows="4"
                            />
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary px-5">
                                Submit Profile
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

  )
}

export default UserProfileForm

