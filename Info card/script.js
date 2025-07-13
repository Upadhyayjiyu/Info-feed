const cardsData = [
  {
    title: "Modern Family House",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
    details: ["🏠 2,500 sq ft", "🛏 4 Bedrooms", "🛁 3 Bathrooms", "📅 Built: 2018"],
    rating: 85,
  },
  {
    title: "Player: ShadowWolf",
    image: "https://i.imgur.com/4M34hi2.png",
    details: ["🎮 Rank: Diamond", "🏆 Win Rate: 72%", "🕹 K/D Ratio: 2.4", "🧠 Level: 45"],
    rating: 90,
  },
  {
    title: "John Smith - Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    details: ["👔 Position: Product Manager", "📍 Location: New York", "📞 Contact: john.smith@company.com", "📆 Joined: 2021"],
    rating: 75,
  },
  {
    title: "2023 Tesla Model S",
    image: "https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_960_720.jpg",
    details: ["⚡ Electric", "🚗 Range: 396 miles", "🕒 0–60 mph: 1.99s", "💰 Price: $94,990"],
    rating: 95,
  },
  {
    title: "The Alchemist",
    image: "https://covers.openlibrary.org/b/id/10523389-L.jpg",
    details: ["✍️ Author: Paulo Coelho", "📚 Genre: Adventure, Fiction", "📅 Published: 1988", "⭐ Rating: 4.7/5"],
    rating: 88,
  },
  {
    title: "Pasta Carbonara",
    image: "https://cdn.pixabay.com/photo/2014/12/15/13/40/pasta-569072_960_720.jpg",
    details: ["🍝 Italian", "⏱ 30 mins", "🔥 Spicy"],
    rating: 80,
  },
  {
    title: "JavaScript Bootcamp",
    image: "https://cdn.pixabay.com/photo/2017/08/06/00/03/web-2589390_960_720.jpg",
    details: ["📘 30 Hours", "🎓 Beginner", "📈 Certificate"],
    rating: 92,
  },
  {
    title: "Noise Smartwatch",
    image: "https://cdn.pixabay.com/photo/2016/11/29/03/14/apple-1868496_960_720.jpg",
    details: ["⌚ Touch Display", "🔋 7 Day Battery", "💵 $60"],
    rating: 78,
  },
  {
    title: "Interstellar",
    image: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg",
    details: ["🎬 Sci-Fi", "⭐ 8.6/10", "⏱ 2h 49m"],
    rating: 94,
  },
  {
    title: "Adopt Bella 🐶",
    image: "https://cdn.pixabay.com/photo/2016/02/19/10/00/dog-1209044_960_720.jpg",
    details: ["🐾 Labrador", "👶 2 years old", "🩺 Vaccinated"],
    rating: 85,
  }
];

const container = document.getElementById("cardContainer");
const darkModeBtn = document.getElementById("darkModeToggle");

function createCard(card, index) {
  const cardEl = document.createElement("div");
  cardEl.classList.add("card");
  cardEl.setAttribute("draggable", "true");

  cardEl.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <span class="favorite-icon" data-index="${index}">&#10084;</span>
        <img src="${card.image}" alt="${card.title}">
        <h2>${card.title}</h2>
        <button class="toggle-details-btn">Show Details</button>
      </div>
      <div class="card-back">
        <h2>${card.title}</h2>
        <ul class="details-list">
          ${card.details.map(detail => `<li>${detail}</li>`).join("")}
        </ul>
        <div class="rating-bar">
          <div class="rating-fill" style="width:${card.rating}%"></div>
        </div>
        <div class="actions">
          <button class="tts-btn">🔈 Speak</button>
          <button class="flip-btn">🔄 Flip</button>
        </div>
      </div>
    </div>
  `;

  return cardEl;
}

function renderCards() {
  container.innerHTML = "";
  cardsData.forEach((card, index) => {
    const cardEl = createCard(card, index);
    container.appendChild(cardEl);
  });
  addEventListeners();
}

function addEventListeners() {
  // Toggle Details button flips card
  document.querySelectorAll(".toggle-details-btn").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".card");
      card.classList.toggle("flipped");
      btn.textContent = card.classList.contains("flipped") ? "Hide Details" : "Show Details";
    };
  });

  // Flip button flips card back
  document.querySelectorAll(".flip-btn").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".card");
      card.classList.toggle("flipped");
      const toggleBtn = card.querySelector(".toggle-details-btn");
      toggleBtn.textContent = card.classList.contains("flipped") ? "Hide Details" : "Show Details";
    };
  });

  // Favorite toggle
  document.querySelectorAll(".favorite-icon").forEach(icon => {
    const idx = icon.dataset.index;
    if (localStorage.getItem("fav-" + idx) === "true") {
      icon.classList.add("active");
    }
    icon.onclick = () => {
      icon.classList.toggle("active");
      localStorage.setItem("fav-" + idx, icon.classList.contains("active"));
    };
  });

  // Text-to-Speech
  document.querySelectorAll(".tts-btn").forEach(btn => {
    btn.onclick = () => {
      const card = btn.closest(".card");
      const detailsText = Array.from(card.querySelectorAll(".details-list li"))
        .map(li => li.textContent)
        .join(", ");
      const utterance = new SpeechSynthesisUtterance(detailsText);
      speechSynthesis.speak(utterance);
    };
  });

  // Drag and Drop
  let dragged = null;

  container.querySelectorAll(".card").forEach(card => {
    card.addEventListener("dragstart", e => {
      dragged = card;
      setTimeout(() => card.style.visibility = "hidden", 0);
    });

    card.addEventListener("dragend", e => {
      dragged = null;
      container.querySelectorAll(".card").forEach(c => c.style.visibility = "visible");
    });

    card.addEventListener("dragover", e => e.preventDefault());

    card.addEventListener("dragenter", e => {
      if (card !== dragged) {
        card.style.border = "2px dashed var(--accent)";
      }
    });

    card.addEventListener("dragleave", e => {
      card.style.border = "";
    });

    card.addEventListener("drop", e => {
      e.preventDefault();
      if (card !== dragged) {
        card.style.border = "";
        container.insertBefore(dragged, card.nextSibling);
      }
    });
  });
}

// Dark Mode toggle
darkModeBtn.onclick = () => {
  document.body.classList.toggle("dark");
};

renderCards();
