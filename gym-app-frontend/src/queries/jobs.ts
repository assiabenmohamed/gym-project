import axios from "axios"

export async function getJobs() {
	const jobs = await axios.get("http://localhost:5000/jobs")
	return jobs.data
}
