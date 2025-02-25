document.addEventListener("DOMContentLoaded", () => {

  const button = document.getElementById("clickModalkBtn");
  const modal = document.getElementById("modal");
  const nextBtn = document.getElementById("nextBtn");
  const jobContent = document.getElementById("jobContent");
  const dots = [
    document.getElementById("dotOne"),
    document.getElementById("dotTwo"),
    document.getElementById("dotThree"),
  ];

  let currentPage = 1;

  button?.addEventListener("click", () => {
    if (modal) {
      modal.style.display = "flex";
      ContentUpdate();
    }
  });


  nextBtn?.addEventListener("click", () => {
    if (currentPage === 3) {
      modal.style.display = "none";
      location.reload();
    } else {
      currentPage = (currentPage % 3) + 1;
      ContentUpdate();
    }
  });

  

  const ContentUpdate = () => {
    if (!jobContent) return console.error("Error: jobContent element not found!");
    jobContent.innerHTML = "";

    const pages = {
      1: "./sectionOne.html",
      2: "./sectionTwo.html",
      3: "./sectionThree.html",
    };

    const page = pages[currentPage];
    if (typeof page === "string" && page.includes(".html")) {
      fetch(page)
        .then((response) =>
          response.ok ? response.text() : Promise.reject(`Failed to load ${page}`)
        )
        .then((data) => {
          jobContent.innerHTML = data;
          if (currentPage === 2) setupDropdown();
        })
        .catch((error) => console.error(`Error loading ${page}:`, error));
    } else {
      jobContent.textContent = page;
    }

    nextBtn.textContent = currentPage === 3 ? "Create Job" : "Next";
    nextBtn.style.fontFamily = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";

    dots.forEach((dot, index) =>
      dot?.classList.toggle("active", index + 1 === currentPage)
    );
  };

  window.addEventListener("click", (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  const waitForTableBody = (callback) => {
    const interval = setInterval(() => {
      const tableBody = document.getElementById("tableBody");
      const pageInfo = document.getElementById("pageInfo");
      const firstBtn = document.getElementById("firstBtn");
      const prevBtn = document.getElementById("prevBtn");
      const nextBtn = document.getElementById("nextBtn");
      const lastBtn = document.getElementById("lastBtn");
      const searchInput = document.getElementById("searchInput");
      const clearBtn = document.getElementById("clearBtn");

      if (!searchInput || !clearBtn) {
        console.error("searchInput or clearBtn not found!");
        return;  
      }
  
      searchInput.addEventListener("input", () => {
        clearBtn.style.display = searchInput.value ? "block" : "none";
      });

      clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.style.display = "none";
        searchInput.dispatchEvent(new Event("input")); 
      });

      clearBtn.style.display = "none"; 
  

      if (tableBody && pageInfo && firstBtn && prevBtn && nextBtn && lastBtn && searchInput) {
        clearInterval(interval);
        callback(tableBody, pageInfo, firstBtn, prevBtn, nextBtn, lastBtn, searchInput);
      }
    }, 500);
  };

  waitForTableBody((tableBody, pageInfo, firstBtn, prevBtn, nextBtn, lastBtn, searchInput) => {
  

    const data = [
      { org: "Tesla", code: "TSLA", handler: "Elon" },
      { org: "Netflix", code: "NFLX", handler: "Shannon" },
      { org: "Amazon", code: "AMZN", handler: "Jeff" },
      { org: "Microsoft", code: "MSFT", handler: "Satya" },
      { org: "Spotify", code: "SPTF", handler: "Daniel" },
      { org: "Uber", code: "UBER", handler: "Travis" },
      { org: "Snapchat", code: "SNAP", handler: "Evan" },
      { org: "LinkedIn", code: "LNKD", handler: "Reid" },
      { org: "Twitter", code: "TWTR", handler: "Jack" },
      { org: "Apple", code: "APPL", handler: "Tim" },
      { org: "Google", code: "GOGL", handler: "Sundar" },
      { org: "Zoom", code: "ZM", handler: "Eric" },
      { org: "Slack", code: "WORK", handler: "Stewart" },
      { org: "Airbnb", code: "ABNB", handler: "Brian" },
      { org: "Stripe", code: "STRP", handler: "Patrick" },
      { org: "Pinterest", code: "PINS", handler: "Ben" },
      { org: "Shopify", code: "SHOP", handler: "Tobi" },
      { org: "Salesforce", code: "CRM", handler: "Marc" },
      { org: "IBM", code: "IBM", handler: "Arvind" },
      { org: "Adobe", code: "ADBE", handler: "Shantanu" },
      { org: "GitHub", code: "GITH", handler: "Nat" }
    ];

    const rowsPerPage = 5;
    let currentIndex = 0;
    let selectedCheckboxes = new Set();
    let filteredData = [...data];

    const applySearchFilter = (query) => {
      filteredData = query
        ? data.filter((item) =>
            [item.org, item.code, item.handler].some((val) =>
              val.toLowerCase().includes(query.toLowerCase())
            )
          )
        : [...data];

      currentIndex = 0;
      displayData();
    };

    searchInput.addEventListener("input", (e) => applySearchFilter(e.target.value));

    const displayData = () => {
      tableBody.innerHTML = "";

      const visibleRows = filteredData.slice(currentIndex, currentIndex + rowsPerPage);
      visibleRows.forEach((item) => {
        const row = document.createElement("div");
        row.className = "table-row";

        const isChecked = selectedCheckboxes.has(item.code);
        row.innerHTML = `
          <span><input type="checkbox" class="rowCheckbox" data-id="${item.code}" ${isChecked ? "checked" : ""}></span>
          <span>${item.org}</span>
          <span>${item.code}</span>
          <span>${item.handler}</span>
        `;
        tableBody.appendChild(row);
      });

      const start = currentIndex + 1;
      const end = Math.min(currentIndex + rowsPerPage, filteredData.length);
      pageInfo.textContent = `${start}-${end} of ${filteredData.length}`;

      updatePaginationButtons();

      tableBody.querySelectorAll(".rowCheckbox").forEach((checkbox) => {
        checkbox.addEventListener("change", (e) => {
          const id = e.target.getAttribute("data-id");
          if (e.target.checked) selectedCheckboxes.add(id);
          else selectedCheckboxes.delete(id);
        });
      });

      firstBtn.disabled = prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = lastBtn.disabled = currentIndex + rowsPerPage >= filteredData.length;
    };

    const updatePaginationButtons = () => {
      const isAtStart = currentIndex === 0;
      const isAtEnd = currentIndex + rowsPerPage >= filteredData.length;
  
      firstBtn.classList.toggle("disabled", isAtStart);
      prevBtn.classList.toggle("disabled", isAtStart);
      nextBtn.classList.toggle("disabled", isAtEnd);
      lastBtn.classList.toggle("disabled", isAtEnd);
    };

    const changePage = (offset) => {
      const newIndex = currentIndex + offset;
      if (newIndex >= 0 && newIndex < filteredData.length) {
        currentIndex = newIndex;
        displayData();
      }
    };
  
    firstBtn.addEventListener("click", () => !firstBtn.classList.contains("disabled") && changePage(-currentIndex));
    prevBtn.addEventListener("click", () => !prevBtn.classList.contains("disabled") && changePage(-rowsPerPage));
    nextBtn.addEventListener("click", () => !nextBtn.classList.contains("disabled") && changePage(rowsPerPage));
    lastBtn.addEventListener("click", () => !lastBtn.classList.contains("disabled") && changePage(filteredData.length - rowsPerPage));
  
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      filteredData = data.filter(item =>
        item.org.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.handler.toLowerCase().includes(query)
      );
      currentIndex = 0;
      displayData();
    });
  
    displayData();
  });

  const setupDropdown = () => {
    const dropdown = document.getElementById("templateDropdown");
    const templateOneDiv = document.getElementById("templateOneDiv");

    if (dropdown && templateOneDiv) {
      templateOneDiv.classList.add("hidden-div");

      dropdown.addEventListener("change", function () {
        console.log("Selected value:", this.value);
        if (this.value === "1") {
          templateOneDiv.classList.remove("hidden-div");
          templateOneDiv.classList.add("visible-div");
        } else {
          templateOneDiv.classList.add("hidden-div");
          templateOneDiv.classList.remove("visible-div");
        }
      });
    } else {
      console.error("Dropdown or templateOneDiv not found.");
    }
  };
});
