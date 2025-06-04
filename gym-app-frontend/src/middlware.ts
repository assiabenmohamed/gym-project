import axios from "axios";
import { NextResponse, type NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // - get the user cookie
  const userId = request.cookies.get("user");
  // - send request to backend
  const response = await axios.get(
    "http://localhost:5000/users/me/" + userId?.value,
    {
      withCredentials: true,
    }
  );
  // - verify if the user exists
  // - if no redirect to "/"
  if (!response.data._id) {
    return NextResponse.redirect(new URL("/", request.url));
  }
}
