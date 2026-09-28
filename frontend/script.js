const API_BASE_URL = "http://localhost:8081/api";
let allEmployees = [];


// ===============================
// SECTION NAVIGATION
// ===============================

function showSection(sectionId) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });


    // Show selected section
    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active");
    }


    // Update active sidebar button
    const navButtons =
        document.querySelectorAll(".nav-btn");

    navButtons.forEach(button => {
        button.classList.remove("active");
    });


    navButtons.forEach(button => {

        const onclickValue =
            button.getAttribute("onclick");

        if (
            onclickValue &&
            onclickValue.includes(`'${sectionId}'`)
        ) {
            button.classList.add("active");
        }

    });


    // Load roster dropdowns
    if (sectionId === "rosters") {
        prepareRosterForm();
    }


    // Load swap request data
    if (sectionId === "swapRequests") {
        prepareSwapForm();
        loadSwapRequests();
    }

}

// ===============================
// LOAD DASHBOARD COUNTS
// ===============================

async function loadDashboardCounts() {

    try {

        const employeesResponse =
            await fetch(`${API_BASE_URL}/employees`);

        const shiftsResponse =
            await fetch(`${API_BASE_URL}/shifts`);

        const rostersResponse =
            await fetch(`${API_BASE_URL}/rosters`);

        const swapsResponse =
            await fetch(`${API_BASE_URL}/swap-requests`);


        const employees = await employeesResponse.json();
        const shifts = await shiftsResponse.json();
        const rosters = await rostersResponse.json();
        const swaps = await swapsResponse.json();


        document.getElementById("employeeCount").textContent =
            employees.length;

        document.getElementById("shiftCount").textContent =
            shifts.length;

        document.getElementById("rosterCount").textContent =
            rosters.length;

        document.getElementById("swapCount").textContent =
            swaps.length;

    } catch (error) {

        console.error("Dashboard loading error:", error);

    }

}


// ===============================
// LOAD EMPLOYEES
// ===============================

async function loadEmployees() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/employees`);

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const employees =
            await response.json();
            allEmployees = employees;


        if (employees.length === 0) {

            document.getElementById("employeeTable").innerHTML = `
                <div class="empty-state">
                    <h3>No Employees Found</h3>
                    <p>Add an employee using the form above.</p>
                </div>
            `;

            return;
        }


        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>
        `;


        employees.forEach(employee => {

            const statusClass =
                employee.status === "ACTIVE"
                    ? "status-active"
                    : "status-inactive";


            html += `

                <tr>

                    <td>
                        #${employee.id}
                    </td>


                    <td>

                        <strong>
                            ${employee.name}
                        </strong>

                        <br>

                        <small style="color:#94a3b8;">
                            ${employee.employeeCode}
                        </small>

                    </td>


                    <td>
                        ${employee.email}
                    </td>


                    <td>
                        ${employee.role}
                    </td>


                    <td>
                        ${employee.department}
                    </td>


                    <td>

                        <span class="status-badge ${statusClass}">
                            ${employee.status}
                        </span>

                    </td>


                    <td>

                        <button
                            class="edit-btn"
                            onclick="editEmployee(${employee.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteEmployee(${employee.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>

            </table>
        `;


        document.getElementById("employeeTable").innerHTML =
            html;


    } catch (error) {

        console.error(
            "Employee loading error:",
            error
        );


        document.getElementById("employeeTable").innerHTML = `

            <div class="error-state">
                Unable to load employees.
            </div>

        `;

    }

}

// ===============================
// LOAD SHIFTS
// ===============================

async function loadShifts() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/shifts`);

        if (!response.ok) {
            throw new Error("Failed to load shifts");
        }

        const shifts =
            await response.json();


        if (shifts.length === 0) {

            document.getElementById("shiftTable").innerHTML = `
                <div class="empty-state">
                    <h3>No Shifts Found</h3>
                    <p>Create a shift using the form above.</p>
                </div>
            `;

            return;
        }


        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Shift</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>
        `;


        shifts.forEach(shift => {

            html += `

                <tr>

                    <td>
                        #${shift.id}
                    </td>


                    <td>

                        <strong>
                            ${shift.shiftName}
                        </strong>

                    </td>


                    <td>

                        <span class="status-badge status-assigned">
                            ${shift.startTime}
                        </span>

                    </td>


                    <td>

                        <span class="status-badge status-pending">
                            ${shift.endTime}
                        </span>

                    </td>


                    <td>
                        ${shift.description || "—"}
                    </td>


                    <td>

                        <button
                            class="edit-btn"
                            onclick="editShift(${shift.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteShift(${shift.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>

            </table>
        `;


        document.getElementById("shiftTable").innerHTML =
            html;


    } catch (error) {

        console.error(
            "Shift loading error:",
            error
        );


        document.getElementById("shiftTable").innerHTML = `

            <div class="error-state">
                Unable to load shifts.
            </div>

        `;

    }

}

// ===============================
// LOAD ROSTERS
// ===============================

async function loadRosters() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/rosters`);

        if (!response.ok) {
            throw new Error("Failed to load rosters");
        }

        const rosters =
            await response.json();


        if (rosters.length === 0) {

            document.getElementById("rosterTable").innerHTML = `
                <div class="empty-state">
                    <h3>No Rosters Found</h3>
                    <p>Create a roster assignment using the form above.</p>
                </div>
            `;

            return;
        }


        let html = `
            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Employee</th>
                        <th>Shift</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>
        `;


        rosters.forEach(roster => {

            let statusClass = "status-pending";

            if (roster.status === "ASSIGNED") {
                statusClass = "status-assigned";
            }

            if (roster.status === "OFF") {
                statusClass = "status-off";
            }

            if (roster.status === "INACTIVE") {
                statusClass = "status-inactive";
            }


            html += `

                <tr>

                    <td>
                        #${roster.id}
                    </td>


                    <td>

                        <strong>
                            ${roster.employee.name}
                        </strong>

                        <br>

                        <small style="color:#94a3b8;">
                            ${roster.employee.employeeCode}
                        </small>

                    </td>


                    <td>

                        <strong>
                            ${roster.shift.shiftName}
                        </strong>

                        <br>

                        <small style="color:#94a3b8;">
                            ${roster.shift.startTime}
                            -
                            ${roster.shift.endTime}
                        </small>

                    </td>


                    <td>
                        ${roster.rosterDate}
                    </td>


                    <td>

                        <span class="status-badge ${statusClass}">
                            ${roster.status || "PENDING"}
                        </span>

                    </td>


                    <td>

                        <button
                            class="edit-btn"
                            onclick="editRoster(${roster.id})"
                        >
                            Edit
                        </button>


                        <button
                            class="delete-btn"
                            onclick="deleteRoster(${roster.id})"
                        >
                            Delete
                        </button>

                    </td>

                </tr>

            `;

        });


        html += `
                </tbody>

            </table>
        `;


        document.getElementById("rosterTable").innerHTML =
            html;


    } catch (error) {

        console.error(
            "Roster loading error:",
            error
        );


        document.getElementById("rosterTable").innerHTML = `

            <div class="error-state">
                Unable to load rosters.
            </div>

        `;

    }

}


async function loadSwapRequests() {
    try {
        const response = await fetch(`${API_BASE_URL}/swap-requests`);

        if (!response.ok) {
            throw new Error("Failed to load swap requests");
        }

        const requests = await response.json();

        if (requests.length === 0) {
            document.getElementById("swapTable").innerHTML = `
                <div class="empty-state">
                    <h3>No Swap Requests Found</h3>
                    <p>Create a swap request using the form above.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Requester</th>
                        <th>Target Employee</th>
                        <th>Requester Shift</th>
                        <th>Target Shift</th>
                        <th>Reason</th>
                        <th>Colleague Approval</th>
                        <th>Manager Approval</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        requests.forEach(request => {

            const colleagueApproval =
                request.colleagueApproval || "PENDING";

            const managerApproval =
                request.managerApproval || "PENDING";

            const status =
                request.status || "PENDING";

            let statusClass = "status-pending";

            if (status === "APPROVED") {
                statusClass = "status-active";
            } else if (status === "REJECTED") {
                statusClass = "status-inactive";
            }

            html += `
                <tr>

                    <td>#${request.id}</td>

                    <td>
                        <strong>
                            ${request.requester?.name || "-"}
                        </strong>
                    </td>

                    <td>
                        ${request.targetEmployee?.name || "-"}
                    </td>

                    <td>
                        ${request.requesterRoster?.shift?.shiftName || "-"}
                        <br>
                        <small style="color:#94a3b8;">
                            ${request.requesterRoster?.rosterDate || ""}
                        </small>
                    </td>

                    <td>
                        ${request.targetRoster?.shift?.shiftName || "-"}
                        <br>
                        <small style="color:#94a3b8;">
                            ${request.targetRoster?.rosterDate || ""}
                        </small>
                    </td>

                    <td>
                        ${request.reason || "-"}
                    </td>

                    <td>
                        <span class="status-badge ${
                            colleagueApproval === "APPROVED"
                                ? "status-active"
                                : colleagueApproval === "REJECTED"
                                    ? "status-inactive"
                                    : "status-pending"
                        }">
                            ${colleagueApproval}
                        </span>
                    </td>

                    <td>
                        <span class="status-badge ${
                            managerApproval === "APPROVED"
                                ? "status-active"
                                : managerApproval === "REJECTED"
                                    ? "status-inactive"
                                    : "status-pending"
                        }">
                            ${managerApproval}
                        </span>
                    </td>

                    <td>
                        <span class="status-badge ${statusClass}">
                            ${status}
                        </span>
                    </td>

                    <td>
            `;

            // Colleague actions
            if (
                colleagueApproval === "PENDING" &&
                status !== "REJECTED"
            ) {
                html += `
                    <button
                        class="edit-btn"
                        onclick="approveColleague(${request.id})">
                        Colleague Approve
                    </button>

                    <button
                        class="delete-btn"
                        onclick="rejectColleague(${request.id})">
                        Colleague Reject
                    </button>
                `;
            }

            // Manager actions
            if (
                colleagueApproval === "APPROVED" &&
                managerApproval === "PENDING"
            ) {
                html += `
                    <button
                        class="edit-btn"
                        onclick="approveManager(${request.id})">
                        Manager Approve
                    </button>

                    <button
                        class="delete-btn"
                        onclick="rejectManager(${request.id})">
                        Manager Reject
                    </button>
                `;
            }

            html += `
                    <button
                        class="delete-btn"
                        onclick="deleteSwap(${request.id})">
                        Delete
                    </button>

                    </td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        document.getElementById("swapTable").innerHTML = html;

    } catch (error) {

        console.error(
            "Swap request loading error:",
            error
        );

        document.getElementById("swapTable").innerHTML = `
            <div class="error-state">
                Unable to load swap requests.
            </div>
        `;
    }
}


// ===============================
// INITIAL LOAD
// ===============================

window.addEventListener("load", () => {

    loadDashboardCounts();

});
// ===============================
// ADD EMPLOYEE
// ===============================

document.getElementById("employeeForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const employee = {
        employeeCode: document.getElementById("employeeCode").value,
        name: document.getElementById("employeeName").value,
        email: document.getElementById("employeeEmail").value,
        role: document.getElementById("employeeRole").value,
        department: document.getElementById("employeeDepartment").value,
        status: document.getElementById("employeeStatus").value
    };

    try {

        const response = await fetch(`${API_BASE_URL}/employees`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(employee)

        });

        if (!response.ok) {

            const errorText = await response.text();

            console.error("Server error:", errorText);

            alert("Failed to add employee.");

            return;
        }

        const savedEmployee = await response.json();

        console.log("Employee added:", savedEmployee);

        alert("Employee added successfully!");

        // Clear form
        document.getElementById("employeeForm").reset();

        // Refresh employee list
        loadEmployees();

        // Refresh dashboard count
        loadDashboardCounts();

    } catch (error) {

        console.error("Error adding employee:", error);

        alert("Unable to connect to Spring Boot server.");

    }

});
// ===============================
// EDIT EMPLOYEE
// ===============================

async function editEmployee(id) {

    try {

        const response =
            await fetch(`${API_BASE_URL}/employees/${id}`);

        if (!response.ok) {
            alert("Employee not found.");
            return;
        }

        const employee = await response.json();

        const newName = prompt(
            "Enter employee name:",
            employee.name
        );

        if (newName === null) {
            return;
        }

        const newEmail = prompt(
            "Enter employee email:",
            employee.email
        );

        if (newEmail === null) {
            return;
        }

        const newRole = prompt(
            "Enter employee role:",
            employee.role
        );

        if (newRole === null) {
            return;
        }

        const newDepartment = prompt(
            "Enter department:",
            employee.department
        );

        if (newDepartment === null) {
            return;
        }

        const updatedEmployee = {

            employeeCode: employee.employeeCode,

            name: newName,

            email: newEmail,

            role: newRole,

            department: newDepartment,

            status: employee.status

        };


        const updateResponse =
            await fetch(`${API_BASE_URL}/employees/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedEmployee)

            });


        if (!updateResponse.ok) {

            const errorText =
                await updateResponse.text();

            console.error(errorText);

            alert("Failed to update employee.");

            return;
        }


        alert("Employee updated successfully!");

        loadEmployees();

        loadDashboardCounts();

    } catch (error) {

        console.error("Edit employee error:", error);

        alert("Unable to update employee.");

    }
}


// ===============================
// DELETE EMPLOYEE
// ===============================

async function deleteEmployee(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API_BASE_URL}/employees/${id}`, {

                method: "DELETE"

            });


        if (!response.ok) {

            alert(
                "Cannot delete this employee. " +
                "The employee may be used in a roster or swap request."
            );

            return;
        }


        alert("Employee deleted successfully!");

        loadEmployees();

        loadDashboardCounts();

    } catch (error) {

        console.error("Delete employee error:", error);

        alert("Unable to delete employee.");

    }


}
// ===============================
// ADD SHIFT
// ===============================

document.getElementById("shiftForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const shift = {

        shiftName:
            document.getElementById("shiftName").value,

        startTime:
            document.getElementById("shiftStartTime").value + ":00",

        endTime:
            document.getElementById("shiftEndTime").value + ":00",

        description:
            document.getElementById("shiftDescription").value

    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/shifts`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(shift)
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(errorText);

            alert("Failed to add shift.");

            return;
        }


        const savedShift =
            await response.json();

        console.log("Shift added:", savedShift);

        alert("Shift added successfully!");

        document.getElementById("shiftForm").reset();

        loadShifts();

        loadDashboardCounts();


    } catch (error) {

        console.error("Add shift error:", error);

        alert("Unable to connect to Spring Boot server.");

    }

});
// ===============================
// EDIT SHIFT
// ===============================

async function editShift(id) {

    try {

        const response =
            await fetch(`${API_BASE_URL}/shifts/${id}`);

        if (!response.ok) {
            alert("Shift not found.");
            return;
        }

        const shift = await response.json();

        const newName = prompt(
            "Enter shift name:",
            shift.shiftName
        );

        if (newName === null) {
            return;
        }

        const newStartTime = prompt(
            "Enter start time (HH:MM):",
            shift.startTime.substring(0, 5)
        );

        if (newStartTime === null) {
            return;
        }

        const newEndTime = prompt(
            "Enter end time (HH:MM):",
            shift.endTime.substring(0, 5)
        );

        if (newEndTime === null) {
            return;
        }

        const newDescription = prompt(
            "Enter description:",
            shift.description || ""
        );

        if (newDescription === null) {
            return;
        }


        const updatedShift = {

            shiftName: newName,

            startTime: newStartTime + ":00",

            endTime: newEndTime + ":00",

            description: newDescription

        };


        const updateResponse =
            await fetch(`${API_BASE_URL}/shifts/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedShift)

            });


        if (!updateResponse.ok) {

            const errorText =
                await updateResponse.text();

            console.error(errorText);

            alert("Failed to update shift.");

            return;
        }


        alert("Shift updated successfully!");

        loadShifts();

        loadDashboardCounts();

    } catch (error) {

        console.error("Edit shift error:", error);

        alert("Unable to update shift.");

    }

}
// ===============================
// DELETE SHIFT
// ===============================

async function deleteShift(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this shift?"
    );

    if (!confirmed) {
        return;
    }

    try {

        const response =
            await fetch(`${API_BASE_URL}/shifts/${id}`, {
                method: "DELETE"
            });

        if (!response.ok) {

            alert(
                "Cannot delete this shift. " +
                "The shift may be used in a roster."
            );

            return;
        }

        alert("Shift deleted successfully!");

        loadShifts();

        loadDashboardCounts();

    } catch (error) {

        console.error("Delete shift error:", error);

        alert("Unable to delete shift.");

    }
}
// ===============================
// LOAD EMPLOYEES INTO ROSTER FORM
// ===============================

async function loadRosterEmployees() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/employees`);

        const employees =
            await response.json();

        const select =
            document.getElementById("rosterEmployee");

        select.innerHTML =
            '<option value="">Select Employee</option>';

        employees.forEach(employee => {

            select.innerHTML += `
                <option value="${employee.id}">
                    ${employee.employeeCode} - ${employee.name}
                </option>
            `;

        });

    } catch (error) {

        console.error(
            "Error loading roster employees:",
            error
        );

    }
}


// ===============================
// LOAD SHIFTS INTO ROSTER FORM
// ===============================

async function loadRosterShifts() {

    try {

        const response =
            await fetch(`${API_BASE_URL}/shifts`);

        const shifts =
            await response.json();

        const select =
            document.getElementById("rosterShift");

        select.innerHTML =
            '<option value="">Select Shift</option>';

        shifts.forEach(shift => {

            select.innerHTML += `
                <option value="${shift.id}">
                    ${shift.shiftName}
                </option>
            `;

        });

    } catch (error) {

        console.error(
            "Error loading roster shifts:",
            error
        );

    }
}
// ===============================
// ADD ROSTER
// ===============================

document.getElementById("rosterForm").addEventListener("submit", async function (event) {

    event.preventDefault();

    const roster = {

        employee: {
            id: Number(
                document.getElementById("rosterEmployee").value
            )
        },

        shift: {
            id: Number(
                document.getElementById("rosterShift").value
            )
        },

        rosterDate:
            document.getElementById("rosterDate").value,

        status:
            document.getElementById("rosterStatus").value

    };


    try {

        const response = await fetch(
            `${API_BASE_URL}/rosters`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(roster)
            }
        );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(errorText);

            alert("Failed to create roster.");

            return;
        }


        const savedRoster =
            await response.json();

        console.log("Roster created:", savedRoster);

        alert("Roster assigned successfully!");

        document.getElementById("rosterForm").reset();

        loadRosters();

        loadDashboardCounts();

    } catch (error) {

        console.error("Add roster error:", error);

        alert("Unable to connect to Spring Boot server.");

    }

});
// ===============================
// LOAD ROSTER FORM DATA
// ===============================

async function prepareRosterForm() {

    await loadRosterEmployees();

    await loadRosterShifts();

}


// ===============================
// WHEN ROSTER SECTION IS OPENED
// ===============================

const originalShowSection = showSection;

showSection = function(sectionId) {

    originalShowSection(sectionId);

    if (sectionId === "rosters") {

        prepareRosterForm();

    }


};
// ===============================
// EDIT ROSTER
// ===============================

async function editRoster(id) {

    try {

        const response =
            await fetch(`${API_BASE_URL}/rosters/${id}`);

        if (!response.ok) {
            alert("Roster not found.");
            return;
        }

        const roster = await response.json();

        const newDate = prompt(
            "Enter roster date (YYYY-MM-DD):",
            roster.rosterDate
        );

        if (newDate === null) {
            return;
        }

        const newStatus = prompt(
            "Enter status:",
            roster.status
        );

        if (newStatus === null) {
            return;
        }

        const updatedRoster = {

            employee: {
                id: roster.employee.id
            },

            shift: {
                id: roster.shift.id
            },

            rosterDate: newDate,

            status: newStatus

        };


        const updateResponse =
            await fetch(`${API_BASE_URL}/rosters/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedRoster)

            });


        if (!updateResponse.ok) {

            const errorText =
                await updateResponse.text();

            console.error(errorText);

            alert("Failed to update roster.");

            return;
        }


        alert("Roster updated successfully!");

        loadRosters();

        loadDashboardCounts();

    } catch (error) {

        console.error("Edit roster error:", error);

        alert("Unable to update roster.");

    }

}// ===============================
// DELETE ROSTER
// ===============================

async function deleteRoster(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this roster?"
    );

    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`${API_BASE_URL}/rosters/${id}`, {

                method: "DELETE"

            });


        if (!response.ok) {

            alert("Failed to delete roster.");

            return;
        }


        alert("Roster deleted successfully!");

        loadRosters();

        loadDashboardCounts();

    } catch (error) {

        console.error("Delete roster error:", error);

        alert("Unable to delete roster.");

    }

}
async function approveColleague(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests/${id}/colleague-approve`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Colleague approval failed");
        }

        alert("Colleague approved the swap request.");

        loadSwapRequests();

    } catch (error) {

        console.error(error);

        alert("Unable to approve the swap request.");
    }
}


async function rejectColleague(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests/${id}/colleague-reject`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Colleague rejection failed");
        }

        alert("Colleague rejected the swap request.");

        loadSwapRequests();

    } catch (error) {

        console.error(error);

        alert("Unable to reject the swap request.");
    }
}
async function approveManager(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests/${id}/manager-approve`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {

            const errorData = await response.json();

            throw new Error(
                errorData.message ||
                "Manager approval failed"
            );
        }

        alert(
            "Manager approved the swap. " +
            "The roster has been updated."
        );

        loadSwapRequests();
        loadRosters();
        loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Unable to approve the swap."
        );
    }
}
async function rejectManager(id) {

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests/${id}/manager-reject`,
            {
                method: "PUT"
            }
        );

        if (!response.ok) {
            throw new Error("Manager rejection failed");
        }

        alert("Manager rejected the swap request.");

        loadSwapRequests();

    } catch (error) {

        console.error(error);

        alert("Unable to reject the swap request.");
    }
}


async function deleteSwap(id) {

    if (!confirm("Delete this swap request?")) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Delete failed");
        }

        alert("Swap request deleted!");

        loadSwapRequests();

        loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert("Unable to delete request.");
    }
}
async function prepareSwapForm() {

    try {

        const employeesResponse =
            await fetch(`${API_BASE_URL}/employees`);

        const employees =
            await employeesResponse.json();

        const rostersResponse =
            await fetch(`${API_BASE_URL}/rosters`);

        const rosters =
            await rostersResponse.json();


        const requesterSelect =
            document.getElementById("swapRequester");

        const targetSelect =
            document.getElementById("swapTargetEmployee");

        const requesterRosterSelect =
            document.getElementById("swapRequesterRoster");

        const targetRosterSelect =
            document.getElementById("swapTargetRoster");


        requesterSelect.innerHTML =
            `<option value="">Select Requester</option>`;

        targetSelect.innerHTML =
            `<option value="">Select Target Employee</option>`;

        employees.forEach(employee => {

            requesterSelect.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name} (${employee.employeeCode})
                </option>
            `;

            targetSelect.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name} (${employee.employeeCode})
                </option>
            `;
        });


        requesterRosterSelect.innerHTML =
            `<option value="">Select Roster</option>`;

        targetRosterSelect.innerHTML =
            `<option value="">Select Roster</option>`;


        rosters.forEach(roster => {

            const text =
                `${roster.employee.name} - ${roster.shift.shiftName} - ${roster.rosterDate}`;

            requesterRosterSelect.innerHTML += `
                <option value="${roster.id}">
                    ${text}
                </option>
            `;

            targetRosterSelect.innerHTML += `
                <option value="${roster.id}">
                    ${text}
                </option>
            `;
        });

    } catch (error) {

        console.error("Swap form loading error:", error);

    }
}
document.getElementById("swapForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const body = {

        requester: {
            id: Number(document.getElementById("swapRequester").value)
        },

        targetEmployee: {
            id: Number(document.getElementById("swapTargetEmployee").value)
        },

        requesterRoster: {
            id: Number(document.getElementById("swapRequesterRoster").value)
        },

        targetRoster: {
            id: Number(document.getElementById("swapTargetRoster").value)
        },

        reason: document.getElementById("swapReason").value

    };

    try {

        const response = await fetch(
            `${API_BASE_URL}/swap-requests`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            }
        );

        if (!response.ok) {
            throw new Error("Create failed");
        }

        alert("Swap request created successfully!");

        document.getElementById("swapForm").reset();

        loadSwapRequests();
        loadDashboardCounts();

    } catch (error) {

        console.error(error);

        alert("Unable to create swap request.");
    }

});
async function prepareSwapForm() {

    try {

        const employeesResponse =
            await fetch(`${API_BASE_URL}/employees`);

        const employees =
            await employeesResponse.json();

        const rostersResponse =
            await fetch(`${API_BASE_URL}/rosters`);

        const rosters =
            await rostersResponse.json();


        const requesterSelect =
            document.getElementById("swapRequester");

        const targetSelect =
            document.getElementById("swapTargetEmployee");

        const requesterRosterSelect =
            document.getElementById("swapRequesterRoster");

        const targetRosterSelect =
            document.getElementById("swapTargetRoster");


        requesterSelect.innerHTML =
            `<option value="">Select Requester</option>`;

        targetSelect.innerHTML =
            `<option value="">Select Target Employee</option>`;


        employees.forEach(employee => {

            requesterSelect.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name} (${employee.employeeCode})
                </option>
            `;

            targetSelect.innerHTML += `
                <option value="${employee.id}">
                    ${employee.name} (${employee.employeeCode})
                </option>
            `;

        });


        requesterRosterSelect.innerHTML =
            `<option value="">Select Roster</option>`;

        targetRosterSelect.innerHTML =
            `<option value="">Select Roster</option>`;


        rosters.forEach(roster => {

            const text =
                `${roster.employee.name} - ${roster.shift.shiftName} - ${roster.rosterDate}`;

            requesterRosterSelect.innerHTML += `
                <option value="${roster.id}">
                    ${text}
                </option>
            `;

            targetRosterSelect.innerHTML += `
                <option value="${roster.id}">
                    ${text}
                </option>
            `;

        });

    } catch (error) {

        console.error("Swap form loading error:", error);

    }

}
function searchEmployees() {

    const searchInput =
        document.getElementById("employeeSearch");

    const searchText =
        searchInput.value.toLowerCase().trim();


    const filteredEmployees =
        allEmployees.filter(employee => {

            return (

                employee.name
                    .toLowerCase()
                    .includes(searchText)

                ||

                employee.employeeCode
                    .toLowerCase()
                    .includes(searchText)

                ||

                employee.email
                    .toLowerCase()
                    .includes(searchText)

                ||

                employee.role
                    .toLowerCase()
                    .includes(searchText)

                ||

                employee.department
                    .toLowerCase()
                    .includes(searchText)

            );

        });


    displayEmployees(filteredEmployees);

}
function displayEmployees(employees) {

    if (employees.length === 0) {

        document.getElementById("employeeTable").innerHTML = `
            <div class="empty-state">
                <h3>No Employees Found</h3>
                <p>Try a different search term.</p>
            </div>
        `;

        return;
    }


    let html = `
        <table>

            <thead>

                <tr>
                    <th>ID</th>
                    <th>Employee</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>
    `;


    employees.forEach(employee => {

        const statusClass =
            employee.status === "ACTIVE"
                ? "status-active"
                : "status-inactive";


        html += `

            <tr>

                <td>
                    #${employee.id}
                </td>

                <td>

                    <strong>
                        ${employee.name}
                    </strong>

                    <br>

                    <small style="color:#94a3b8;">
                        ${employee.employeeCode}
                    </small>

                </td>

                <td>
                    ${employee.email}
                </td>

                <td>
                    ${employee.role}
                </td>

                <td>
                    ${employee.department}
                </td>

                <td>

                    <span class="status-badge ${statusClass}">
                        ${employee.status}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editEmployee(${employee.id})"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteEmployee(${employee.id})"
                    >
                        Delete
                    </button>

                </td>

            </tr>

        `;

    });


    html += `
            </tbody>

        </table>
    `;


    document.getElementById("employeeTable").innerHTML =
        html;

}
document
    .getElementById("employeeSearch")
    .addEventListener("input", searchEmployees);