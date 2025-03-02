document.addEventListener("DOMContentLoaded", () => {
    // Mock Data
    const events = [
        {
            title: "Jazz Night",
            category: "Music",
            description: "Enjoy an evening of smooth jazz with live performances.",
            date: "2025-03-15",
            time: "7:00 PM",
            location: "Downtown Jazz Club",
            image: "https://via.placeholder.com/300x200?text=Jazz+Night",
            organizer: "Local Music Society",
            price: "$20"
        },
        {
            title: "Art Exhibition",
            category: "Arts",
            description: "Explore contemporary art from local artists.",
            date: "2025-03-20",
            time: "10:00 AM",
            location: "City Art Gallery",
            image: "https://via.placeholder.com/300x200?text=Art+Exhibition",
            organizer: "City Art Council",
            price: "Free"
        },
        {
            title: "Food Festival",
            category: "Food",
            description: "Taste delicious dishes from around the world.",
            date: "2025-03-25",
            time: "12:00 PM",
            location: "Central Park",
            image: "https://via.placeholder.com/300x200?text=Food+Festival",
            organizer: "Local Foodies Association",
            price: "$10"
        },
        {
            title: "Tech Conference",
            category: "Technology",
            description: "Learn about the latest trends in technology.",
            date: "2025-04-01",
            time: "9:00 AM",
            location: "Convention Center",
            image: "https://via.placeholder.com/300x200?text=Tech+Conference",
            organizer: "Tech Innovators Inc.",
            price: "$50"
        },
        {
            title: "Community Cleanup",
            category: "Community",
            description: "Join us in cleaning up the local park.",
            date: "2025-04-05",
            time: "8:00 AM",
            location: "Green Valley Park",
            image: "https://via.placeholder.com/300x200?text=Community+Cleanup",
            organizer: "Green Earth Initiative",
            price: "Free"
        },
        {
            title: "Marathon Championship",
            category: "Sports",
            description: "Compete or cheer at the annual marathon event.",
            date: "2025-04-10",
            time: "6:00 AM",
            location: "City Stadium",
            image: "https://via.placeholder.com/300x200?text=Marathon+Championship",
            organizer: "Sports League",
            price: "$30"
        }
    ];

    // DOM Elements
    const eventList = document.getElementById("event-list");
    const categoryFilter = document.getElementById("category-filter");
    const searchBox = document.getElementById("search-box");
    const searchButton = document.getElementById("search-button");
    const modal = document.getElementById("event-modal");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalDate = document.getElementById("modal-date");
    const modalTime = document.getElementById("modal-time");
    const modalLocation = document.getElementById("modal-location");
    const modalOrganizer = document.getElementById("modal-organizer");
    const modalPrice = document.getElementById("modal-price");
    const closeModalButton = document.getElementById("close-modal");

    // Display Events
    function displayEvents(filteredEvents) {
        eventList.innerHTML = "";
        filteredEvents.forEach(event => {
            const eventCard = document.createElement("div");
            eventCard.className = "event-card";
            eventCard.innerHTML = `
                <img src="${event.image}" alt="${event.title}">
                <h3>${event.title}</h3>
                <p><strong>Date:</strong> ${event.date}</p>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                <button class="view-details" data-id="${event.title}">View Details</button>
            `;
            eventList.appendChild(eventCard);
        });

        // Add event listeners to "View Details" buttons
        document.querySelectorAll(".view-details").forEach(button => {
            button.addEventListener("click", () => {
                const eventTitle = button.getAttribute("data-id");
                const event = events.find(e => e.title === eventTitle);
                openModal(event);
            });
        });
    }

    // Filter and Search Events
    function filterEvents() {
        const category = categoryFilter.value;
        const searchTerm = searchBox.value.toLowerCase();
        const filteredEvents = events.filter(event => {
            const matchesCategory = category === "all" || event.category === category;
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) || 
                                 event.description.toLowerCase().includes(searchTerm);
            return matchesCategory && matchesSearch;
        });
        displayEvents(filteredEvents);
    }

    // Open Modal
    function openModal(event) {
        modalImage.src = event.image;
        modalTitle.textContent = event.title;
        modalDescription.textContent = event.description;
        modalDate.textContent = event.date;
        modalTime.textContent = event.time;
        modalLocation.textContent = event.location;
        modalOrganizer.textContent = event.organizer;
        modalPrice.textContent = event.price;
        modal.style.display = "flex";
    }

    // Close Modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Event Listeners
    categoryFilter.addEventListener("change", filterEvents);
    searchBox.addEventListener("input", filterEvents);
    searchButton.addEventListener("click", filterEvents);
    closeModalButton.addEventListener("click", closeModal);

    // Initial Display
    displayEvents(events);

    // Booking Form Submission
    const bookingForm = document.getElementById("booking-form");
    if (bookingForm) {
        bookingForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const bookingData = {
                name: formData.get("name"),
                email: formData.get("email"),
                tickets: formData.get("tickets"),
                eventTitle: document.getElementById("modal-title").textContent,
                eventDate: document.getElementById("modal-date").textContent,
            };

            try {
                const response = await fetch("/book", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(bookingData),
                });

                if (response.ok) {
                    alert("Booking successful! Thank you for booking.");
                    closeModal(); // Close the modal after successful booking
                } else {
                    const errorData = await response.json();
                    alert(`Booking failed: ${errorData.message || "Please try again."}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred. Please try again.");
            }
        });
    }
});