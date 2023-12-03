// import axios from "axios";
// export const getAll = (userType, userId) => {
//   if (userType === "Manager") {
//     const fetchManagerTasks = async () => {
//       try {
//         const response = await axios.post(
//           "http://localhost:5000/get_tasks_by_manager",
//           {
//             managerId: userId,
//           }
//         );
//         setTasks(response.data);
//       } catch (error) {
//         console.error("Error fetching manager tasks:", error);
//       }
//     };

//     fetchManagerTasks();
//   }
//   if (userType === "Client") {
//     axios
//       .post("http://localhost:5000/get_tasks_by_client", {
//         clientId: userId,
//       })
//       .then((response) => setTasks(response.data))
//       .catch((error) => console.error("Error fetching tasks:", error));
//   } else {
//     axios
//       .get("http://localhost:5000/get_tasks")
//       .then((response) => setTasks(response.data))
//       .catch((error) => console.error("Error fetching tasks:", error));
//   }
// };

// export const getEvent = (id) =>
//   fetch(`http://localhost:3001/events/${id}`).then((res) => res.json());

// export const add = (event) => {
//   event.status = event.status || "";
//   event.description = event.description || "";
//   event.backgroundColor = event.backgroundColor || "";
//   event.allDat = event.allDay || false;

//   return fetch("http://localhost:3001/events", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   }).then((res) => res.json());
// };

// export const edit = (event) => {
//   event.status = event.status || "";
//   event.description = event.description || "";
//   event.backgroundColor = event.backgroundColor || "";

//   return fetch("http://localhost:3001/events", {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(event),
//   }).then((res) => res.json());
// };

// export const remove = (id) =>
//   fetch(`http://localhost:3001/events/${id}`, {
//     method: "DELETE",
//   }).then((res) => res.json());
