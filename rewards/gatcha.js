// Minimal working gacha logic with:
// - machine shakes slow then fast
// - multiple balls bouncing and one random ball popping out
// - reward shown in a popup modal
// NOTE: If you use Firebase, include your firebase-init.js separately
// and use onAuthStateChanged here to tie tickets/inventory to a uid.

const genericNames = [
    "Pastel Blob",
    "Soft Orb",
    "Cloud Pop",
    "Mint Puff",
    "Sun Bubble",
    "Moon Pearl",
    "Sky Dot",
    "Blush Marble",
    "Citrus Puff",
    "Berry Bubble",
    "Frost Orb",
    "Glow Pearl",
    "Rose Pop",
    "Aqua Marble",
    "Nebula Dot"
];

// Auto-generate rewards for icons 0–14
const rewardPool = Array.from({ length: 15 }, (_, i) => ({
    id: `icon-${i}`,
    type: "avatar",
    name: genericNames[i],     // 👈 neutral names
    rarity: "common",
    iconType: "image",
    iconSrc: `icons/${i}.png`   // 👈 matches your actual files
}));

let tickets = 3;
let inventory = [];

document.addEventListener("DOMContentLoaded", () => {
    const ticketCountEl = document.getElementById("ticket-count");
    const rollBtn = document.getElementById("roll-btn");
    const machineEl = document.getElementById("machine");
    const gumballs = document.querySelectorAll(".gumball");
    const inventoryGridEl = document.getElementById("inventory-grid");
    const homeLink = document.getElementById("home-link");
    
    // Home link click handler
    if (homeLink) {
        homeLink.addEventListener("click", () => {
            window.location.href = "../indext.html";
        });
    }

    const rewardModal = document.getElementById("reward-modal");
    const modalCloseBtn = document.getElementById("modal-close");
    const modalBackdrop = document.getElementById("reward-backdrop");
    const modalRewardBody = document.getElementById("modal-reward-body");

    function updateTickets() {
        if (ticketCountEl) ticketCountEl.textContent = tickets;
    }

    function renderInventory() {
        if (!inventoryGridEl) return;

        if (inventory.length === 0) {
            inventoryGridEl.innerHTML =
                '<div class="inventory-item"><span class="inventory-name">No rewards yet</span></div>';
            return;
        }

        inventoryGridEl.innerHTML = inventory
            .map(
                (item) => `
          <div class="inventory-item">
            <div class="inventory-item-header">
              <div class="inventory-icon">
                <img src="${item.iconSrc}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;">
              </div>
              <div>
                <div class="inventory-name">${item.name}</div>
                <div class="inventory-type">${item.type} · ${item.rarity}</div>
              </div>
            </div>
          </div>
        `
            )
            .join("");
    }

    function makeRewardPillHTML(reward) {
        return `
      <div class="reward-pill">
        <div class="reward-icon">
          <img src="${reward.iconSrc}" alt="${reward.name}" style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <div class="reward-meta">
          <span class="reward-name">${reward.name}</span>
          <span class="reward-type">${reward.type} · ${reward.rarity}</span>
        </div>
      </div>
    `;
    }

    function openRewardModal(reward) {
        if (!rewardModal) return;
        modalRewardBody.innerHTML = makeRewardPillHTML(reward);
        rewardModal.classList.remove("hidden");
    }

    function closeRewardModal() {
        if (!rewardModal) return;
        rewardModal.classList.add("hidden");
    }

    function rollReward() {
        if (tickets <= 0) {
            alert("No tickets left – earn more by finishing study sessions!");
            return null;
        }

        tickets--;
        updateTickets();

        const idx = Math.floor(Math.random() * rewardPool.length);
        const reward = rewardPool[idx];

        // add to inventory if not already
        if (!inventory.find((item) => item.id === reward.id)) {
            inventory.push(reward);
            renderInventory();
        }

        return reward;
    }

    // Close modal handlers
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeRewardModal);
    }
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", closeRewardModal);
    }

    // Click handler for roll
    rollBtn.addEventListener("click", () => {
        if (tickets <= 0) {
            alert("No tickets left – earn more by finishing study sessions!");
            return;
        }

        rollBtn.disabled = true;

        // reset all ball classes
        gumballs.forEach((ball) => {
            ball.classList.remove("bounce-slow", "bounce-fast", "pop-out");
        });
        machineEl.classList.remove("shake-slow", "shake-fast");

        // Phase 1: slow shake + slow bounce
        void machineEl.offsetWidth;
        machineEl.classList.add("shake-slow");
        gumballs.forEach((ball) => ball.classList.add("bounce-slow"));

        // After ~1.5s, go faster
        setTimeout(() => {
            machineEl.classList.remove("shake-slow");
            gumballs.forEach((ball) => ball.classList.remove("bounce-slow"));

            void machineEl.offsetWidth;
            machineEl.classList.add("shake-fast");
            gumballs.forEach((ball) => ball.classList.add("bounce-fast"));
        }, 1500);

        // After ~2.5s total, stop + pop one random ball + show reward
        setTimeout(() => {
            machineEl.classList.remove("shake-fast");
            gumballs.forEach((ball) => ball.classList.remove("bounce-fast"));

            if (gumballs.length > 0) {
                const randomIndex = Math.floor(Math.random() * gumballs.length);
                const chosenBall = gumballs[randomIndex];

                // pop that one out
                chosenBall.classList.remove("pop-out");
                void chosenBall.offsetWidth;
                chosenBall.classList.add("pop-out");
            }

            const reward = rollReward();
            if (reward) {
                openRewardModal(reward);
            }

            rollBtn.disabled = false;
        }, 2500);
    });

    // initial render
    updateTickets();
    renderInventory();
});
