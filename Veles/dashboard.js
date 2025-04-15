// dashboard.js - Enhanced dashboard functionality for VELES financial tool

class DashboardManager {
  constructor() {
    this.charts = {};
    this.currentTab = "overview";
    this.transactionData = [];
    this.sortConfig = {
      column: "date",
      direction: "desc",
    };
    this.filterConfig = {
      category: "all",
      dateRange: "month",
      minAmount: null,
      maxAmount: null,
    };

    // Financial metrics data
    this.metrics = {
      netWorth: 42680.45,
      monthlyIncome: 4542.45,
      monthlyExpenses: 2931.56,
      monthlySavings: 1610.89,
      savingsRate: 35.46,
      debtToIncome: 0.28,
      emergencyFund: {
        current: 8000,
        target: 10000,
        percentage: 80,
      },
      investmentReturns: {
        ytd: 8.4,
        oneYear: 12.6,
        threeYear: 9.8,
        fiveYear: 11.2,
      },
    };

    // Monthly spending by category
    this.spendingByCategory = [
      { category: "Housing", amount: 1200, percentage: 40.9, trend: 0 },
      {
        category: "Transportation",
        amount: 450,
        percentage: 15.4,
        trend: -2.1,
      },
      { category: "Food", amount: 600, percentage: 20.5, trend: 3.2 },
      { category: "Utilities", amount: 300, percentage: 10.2, trend: 1.5 },
      { category: "Entertainment", amount: 250, percentage: 8.5, trend: 5.3 },
      { category: "Other", amount: 131.56, percentage: 4.5, trend: -1.8 },
    ];

    // Sample transaction data
    this.generateTransactionData();

    // Initialize the dashboard
    this.init();
  }

  init() {
    // Initialize tabs
    this.initTabs();

    // Initialize charts
    this.initCharts();

    // Initialize transaction table
    this.initTransactionTable();

    // Initialize financial metrics
    this.updateFinancialMetrics();

    // Initialize category breakdown
    this.updateCategoryBreakdown();

    // Initialize budget progress
    this.updateBudgetProgress();

    // Initialize event listeners
    this.initEventListeners();
  }

  initTabs() {
    const tabs = document.querySelectorAll(".dashboard-tabs .tab");
    const tabContents = document.querySelectorAll(".tab-content");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remove active class from all tabs and contents
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        tab.classList.add("active");
        const tabId = tab.dataset.tab;
        document.getElementById(`${tabId}-content`).classList.add("active");
        this.currentTab = tabId;

        // Refresh charts when tab changes
        if (this.charts[tabId]) {
          this.charts[tabId].update();
        }
      });
    });
  }

  initCharts() {
    // Enhanced chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: "#e2e2e2",
            font: {
              family: "Inter",
              size: 12,
            },
            padding: 20,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.raw;
              return ` $${value.toLocaleString()}`;
            },
          },
          backgroundColor: "rgba(26, 26, 26, 0.9)",
          borderColor: "rgba(157, 78, 221, 0.4)",
          borderWidth: 1,
          padding: 12,
          titleFont: {
            size: 14,
            family: "Inter",
            weight: "bold",
          },
          bodyFont: {
            size: 14,
            family: "Inter",
          },
          displayColors: true,
          boxPadding: 6,
        },
      },
      animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
        easing: "easeOutQuart",
      },
      hover: {
        mode: "nearest",
        intersect: true,
        animationDuration: 300,
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: "rgba(15, 15, 15, 0.8)",
          hoverBorderColor: "rgba(255, 255, 255, 0.8)",
          hoverOffset: 5,
        },
        line: {
          tension: 0.4,
          borderWidth: 3,
          fill: true,
        },
        point: {
          radius: 4,
          hoverRadius: 6,
          borderWidth: 2,
          hoverBorderWidth: 2,
        },
      },
    };

    // Enhanced data for charts
    const overviewData = {
      labels: [
        "Housing",
        "Transportation",
        "Food",
        "Utilities",
        "Entertainment",
        "Other",
      ],
      datasets: [
        {
          data: [1200, 450, 600, 300, 250, 131.56],
          backgroundColor: [
            "rgba(99, 102, 241, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(236, 72, 153, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(156, 163, 175, 0.8)",
          ],
          hoverBackgroundColor: [
            "rgba(129, 140, 248, 0.9)",
            "rgba(167, 139, 250, 0.9)",
            "rgba(244, 114, 182, 0.9)",
            "rgba(52, 211, 153, 0.9)",
            "rgba(251, 146, 60, 0.9)",
            "rgba(209, 213, 219, 0.9)",
          ],
          borderColor: "rgba(15, 15, 15, 0.8)",
          hoverBorderColor: "rgba(255, 255, 255, 0.8)",
          borderWidth: 2,
        },
      ],
    };

    // Budget data with planned vs actual
    const budgetData = {
      labels: [
        "Housing",
        "Transportation",
        "Food",
        "Utilities",
        "Entertainment",
        "Other",
      ],
      datasets: [
        {
          label: "Budget",
          data: [1200, 400, 500, 300, 200, 150],
          backgroundColor: "rgba(99, 102, 241, 0.4)",
          borderColor: "rgba(99, 102, 241, 0.8)",
          borderWidth: 2,
        },
        {
          label: "Actual",
          data: [1200, 450, 600, 300, 250, 131.56],
          backgroundColor: "rgba(236, 72, 153, 0.4)",
          borderColor: "rgba(236, 72, 153, 0.8)",
          borderWidth: 2,
        },
      ],
    };

    // Goals data with progress
    const goalsData = {
      labels: [
        "Emergency Fund",
        "Vacation",
        "New Car",
        "Home Down Payment",
        "Retirement",
      ],
      datasets: [
        {
          label: "Current",
          data: [8000, 2500, 15000, 25000, 45000],
          backgroundColor: "rgba(99, 102, 241, 0.7)",
          borderColor: "rgba(99, 102, 241, 0.9)",
          borderWidth: 2,
        },
        {
          label: "Target",
          data: [10000, 5000, 30000, 60000, 100000],
          backgroundColor: "rgba(156, 163, 175, 0.3)",
          borderColor: "rgba(156, 163, 175, 0.6)",
          borderWidth: 2,
          borderDash: [5, 5],
        },
      ],
    };

    // Reports data with more detailed financial history
    const reportsData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Income",
          data: [
            4200, 4300, 4250, 4400, 4350, 4500, 4450, 4542, 4600, 4650, 4700,
            4750,
          ],
          borderColor: "rgba(99, 102, 241, 0.8)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Expenses",
          data: [
            2800, 2900, 2750, 2950, 2850, 2900, 2800, 2931, 2950, 3000, 3050,
            3100,
          ],
          borderColor: "rgba(236, 72, 153, 0.8)",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Savings",
          data: [
            1400, 1400, 1500, 1450, 1500, 1600, 1650, 1611, 1650, 1650, 1650,
            1650,
          ],
          borderColor: "rgba(16, 185, 129, 0.8)",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };

    // Net Worth data
    const netWorthData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Assets",
          data: [
            65000, 66500, 68000, 69500, 71000, 72500, 74000, 75500, 77000,
            78500, 80000, 81500,
          ],
          borderColor: "rgba(16, 185, 129, 0.8)",
          backgroundColor: "rgba(16, 185, 129, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Liabilities",
          data: [
            42000, 41500, 41000, 40500, 40000, 39500, 39000, 38500, 38000,
            37500, 37000, 36500,
          ],
          borderColor: "rgba(236, 72, 153, 0.8)",
          backgroundColor: "rgba(236, 72, 153, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Net Worth",
          data: [
            23000, 25000, 27000, 29000, 31000, 33000, 35000, 37000, 39000,
            41000, 43000, 45000,
          ],
          borderColor: "rgba(99, 102, 241, 0.8)",
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          tension: 0.4,
          fill: false,
          borderWidth: 3,
        },
      ],
    };

    // Initialize charts
    this.charts.overview = new Chart(document.getElementById("overviewChart"), {
      type: "doughnut",
      data: overviewData,
      options: {
        ...chartOptions,
        cutout: "60%",
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            ...chartOptions.plugins.tooltip,
            callbacks: {
              label: function (context) {
                const value = context.raw;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return ` $${value.toLocaleString()} (${percentage}%)`;
              },
            },
          },
        },
      },
    });

    this.charts.budget = new Chart(document.getElementById("budgetChart"), {
      type: "bar",
      data: budgetData,
      options: {
        ...chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#e2e2e2",
            },
          },
        },
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            ...chartOptions.plugins.tooltip,
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.raw;
                return `${label}: $${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    this.charts.goals = new Chart(document.getElementById("goalsChart"), {
      type: "bar",
      data: goalsData,
      options: {
        ...chartOptions,
        indexAxis: "y",
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          y: {
            grid: {
              display: false,
            },
            ticks: {
              color: "#e2e2e2",
            },
          },
        },
        plugins: {
          ...chartOptions.plugins,
          tooltip: {
            ...chartOptions.plugins.tooltip,
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.raw;
                return `${label}: $${value.toLocaleString()}`;
              },
            },
          },
        },
      },
    });

    this.charts.reports = new Chart(document.getElementById("reportsChart"), {
      type: "line",
      data: reportsData,
      options: {
        ...chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
            },
          },
        },
      },
    });

    // Add net worth chart to reports tab
    const netWorthChartContainer = document.createElement("div");
    netWorthChartContainer.className = "dashboard-item chart";
    netWorthChartContainer.style.marginTop = "2rem";

    const netWorthChartTitle = document.createElement("h4");
    netWorthChartTitle.textContent = "Net Worth Trend";
    netWorthChartContainer.appendChild(netWorthChartTitle);

    const netWorthCanvas = document.createElement("canvas");
    netWorthCanvas.id = "netWorthChart";
    netWorthChartContainer.appendChild(netWorthCanvas);

    document
      .querySelector("#reports-content .dashboard-grid")
      .appendChild(netWorthChartContainer);

    this.charts.netWorth = new Chart(document.getElementById("netWorthChart"), {
      type: "line",
      data: netWorthData,
      options: {
        ...chartOptions,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
          },
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            ticks: {
              color: "#e2e2e2",
            },
          },
        },
      },
    });
  }

  generateTransactionData() {
    const categories = [
      "Housing",
      "Transportation",
      "Food",
      "Utilities",
      "Entertainment",
      "Income",
      "Other",
    ];
    const descriptions = {
      Housing: [
        "Rent",
        "Mortgage",
        "Property Tax",
        "Home Insurance",
        "Maintenance",
      ],
      Transportation: [
        "Gas",
        "Car Payment",
        "Car Insurance",
        "Public Transit",
        "Uber/Lyft",
      ],
      Food: [
        "Groceries",
        "Restaurant",
        "Coffee Shop",
        "Food Delivery",
        "Takeout",
      ],
      Utilities: [
        "Electricity",
        "Water",
        "Internet",
        "Phone",
        "Streaming Services",
      ],
      Entertainment: [
        "Movies",
        "Concerts",
        "Subscriptions",
        "Hobbies",
        "Sports",
      ],
      Income: ["Salary", "Bonus", "Freelance", "Interest", "Dividends"],
      Other: ["Shopping", "Gifts", "Donations", "Healthcare", "Education"],
    };

    const accounts = [
      "Checking Account",
      "Credit Card",
      "Savings Account",
      "Investment Account",
    ];

    const transactions = [];
    const today = new Date();

    // Generate 50 transactions for the past 30 days
    for (let i = 0; i < 50; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const date = new Date(today);
      date.setDate(date.getDate() - daysAgo);

      const category =
        categories[Math.floor(Math.random() * categories.length)];
      const isIncome = category === "Income";

      const descriptionOptions = descriptions[category];
      const description =
        descriptionOptions[
          Math.floor(Math.random() * descriptionOptions.length)
        ];

      let amount;
      if (isIncome) {
        amount = Math.floor(Math.random() * 3000) + 1000;
      } else {
        amount = Math.floor(Math.random() * 200) + 10;
        if (category === "Housing") amount += 1000;
        if (category === "Transportation") amount += 200;
      }

      const account = accounts[Math.floor(Math.random() * accounts.length)];

      transactions.push({
        id: i + 1,
        date: date,
        description: description,
        category: category,
        amount: isIncome ? amount : -amount,
        account: account,
      });
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => b.date - a.date);

    this.transactionData = transactions;
  }

  initTransactionTable() {
    // Create transaction table in the overview tab
    const overviewContent = document.getElementById("overview-content");

    // Create transaction section
    const transactionSection = document.createElement("div");
    transactionSection.className = "dashboard-item transactions";
    transactionSection.style.marginTop = "2rem";
    transactionSection.style.gridColumn = "1 / -1";

    // Create header with title and filter controls
    const transactionHeader = document.createElement("div");
    transactionHeader.className = "transaction-header";
    transactionHeader.innerHTML = `
            <h4>Recent Transactions</h4>
            <div class="transaction-controls">
                <div class="transaction-filter">
                    <select id="category-filter">
                        <option value="all">All Categories</option>
                        <option value="Housing">Housing</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Food">Food</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Income">Income</option>
                        <option value="Other">Other</option>
                    </select>
                    <select id="date-filter">
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month" selected>This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <div class="transaction-search">
                    <input type="text" id="transaction-search" placeholder="Search transactions...">
                </div>
            </div>
        `;

    transactionSection.appendChild(transactionHeader);

    // Create transaction table
    const transactionTable = document.createElement("table");
    transactionTable.className = "transaction-table";
    transactionTable.innerHTML = `
            <thead>
                <tr>
                    <th data-sort="date" class="sortable active desc">Date <span class="sort-icon">↓</span></th>
                    <th data-sort="description" class="sortable">Description <span class="sort-icon"></span></th>
                    <th data-sort="category" class="sortable">Category <span class="sort-icon"></span></th>
                    <th data-sort="amount" class="sortable">Amount <span class="sort-icon"></span></th>
                    <th data-sort="account" class="sortable">Account <span class="sort-icon"></span></th>
                </tr>
            </thead>
            <tbody id="transaction-body">
                <!-- Transaction rows will be inserted here -->
            </tbody>
        `;

    transactionSection.appendChild(transactionTable);

    // Add pagination controls
    const paginationControls = document.createElement("div");
    paginationControls.className = "pagination-controls";
    paginationControls.innerHTML = `
            <div class="pagination-info">Showing <span id="pagination-start">1</span>-<span id="pagination-end">10</span> of <span id="pagination-total">50</span></div>
            <div class="pagination-buttons">
                <button id="pagination-prev" disabled>Previous</button>
                <button id="pagination-next">Next</button>
            </div>
        `;

    transactionSection.appendChild(paginationControls);

    // Add transaction section to overview content
    overviewContent.appendChild(transactionSection);

    // Render transactions
    this.renderTransactions();
  }

  renderTransactions(page = 1, limit = 10) {
    const tbody = document.getElementById("transaction-body");
    const filteredData = this.getFilteredTransactions();
    const sortedData = this.getSortedTransactions(filteredData);

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = Math.min(start + limit, sortedData.length);
    const paginatedData = sortedData.slice(start, end);

    // Update pagination info
    document.getElementById("pagination-start").textContent =
      sortedData.length > 0 ? start + 1 : 0;
    document.getElementById("pagination-end").textContent = end;
    document.getElementById("pagination-total").textContent = sortedData.length;

    // Update pagination buttons
    document.getElementById("pagination-prev").disabled = page === 1;
    document.getElementById("pagination-next").disabled =
      end >= sortedData.length;

    // Clear existing rows
    tbody.innerHTML = "";

    // Add transaction rows
    paginatedData.forEach((transaction) => {
      const row = document.createElement("tr");

      // Format date
      const date = new Date(transaction.date);
      const formattedDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Format amount with color based on positive/negative
      const amountClass = transaction.amount >= 0 ? "positive" : "negative";
      const formattedAmount = `$${Math.abs(transaction.amount).toLocaleString(
        undefined,
        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
      )}`;

      row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${transaction.description}</td>
                <td>
                    <span class="category-tag ${transaction.category.toLowerCase()}">${
        transaction.category
      }</span>
                </td>
                <td class="amount ${amountClass}">${
        transaction.amount >= 0 ? "+" : "-"
      }${formattedAmount}</td>
                <td>${transaction.account}</td>
            `;

      tbody.appendChild(row);
    });
  }

  getFilteredTransactions() {
    const categoryFilter = document.getElementById("category-filter").value;
    const dateFilter = document.getElementById("date-filter").value;
    const searchTerm = document
      .getElementById("transaction-search")
      .value.toLowerCase();

    return this.transactionData.filter((transaction) => {
      // Category filter
      if (categoryFilter !== "all" && transaction.category !== categoryFilter) {
        return false;
      }

      // Date filter
      const today = new Date();
      const transactionDate = new Date(transaction.date);

      if (dateFilter === "today") {
        if (transactionDate.toDateString() !== today.toDateString()) {
          return false;
        }
      } else if (dateFilter === "week") {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        if (transactionDate < weekStart) {
          return false;
        }
      } else if (dateFilter === "month") {
        if (
          transactionDate.getMonth() !== today.getMonth() ||
          transactionDate.getFullYear() !== today.getFullYear()
        ) {
          return false;
        }
      } else if (dateFilter === "year") {
        if (transactionDate.getFullYear() !== today.getFullYear()) {
          return false;
        }
      }

      // Search filter
      if (searchTerm) {
        const descriptionMatch = transaction.description
          .toLowerCase()
          .includes(searchTerm);
        const categoryMatch = transaction.category
          .toLowerCase()
          .includes(searchTerm);
        const accountMatch = transaction.account
          .toLowerCase()
          .includes(searchTerm);

        if (!descriptionMatch && !categoryMatch && !accountMatch) {
          return false;
        }
      }

      return true;
    });
  }

  getSortedTransactions(transactions) {
    const { column, direction } = this.sortConfig;

    return [...transactions].sort((a, b) => {
      let comparison = 0;

      if (column === "date") {
        comparison = new Date(a.date) - new Date(b.date);
      } else if (column === "amount") {
        comparison = a.amount - b.amount;
      } else if (
        column === "description" ||
        column === "category" ||
        column === "account"
      ) {
        comparison = a[column].localeCompare(b[column]);
      }

      return direction === "asc" ? comparison : -comparison;
    });
  }

  updateFinancialMetrics() {
    // Add financial metrics to the overview tab
    const overviewContent = document.getElementById("overview-content");
    const summarySection = overviewContent.querySelector(
      ".dashboard-item.summary"
    );

    // Create financial metrics section
    const metricsSection = document.createElement("div");
    metricsSection.className = "dashboard-item metrics";
    metricsSection.style.marginTop = "2rem";

    metricsSection.innerHTML = `
            <h4>Financial Health Metrics</h4>
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">$${this.metrics.netWorth.toLocaleString()}</div>
                        <div class="metric-label">Net Worth</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
                            <path d="M14 3v4a2 2 0 0 0 2 2h4" />
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">${
                          this.metrics.savingsRate
                        }%</div>
                        <div class="metric-label">Savings Rate</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                            <path d="M12 6v12" />
                            <path d="M8 6v12" />
                            <path d="M16 6v12" />
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">${
                          this.metrics.debtToIncome
                        }</div>
                        <div class="metric-label">Debt-to-Income</div>
                    </div>
                </div>
                <div class="metric-card">
                    <div class="metric-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7" />
                            <path d="M4 8v4" />
                            <path d="M20 8v4" />
                            <path d="M12 4v4" />
                            <path d="M12 12v4" />
                            <path d="M8 12h8" />
                        </svg>
                    </div>
                    <div class="metric-content">
                        <div class="metric-value">${
                          this.metrics.emergencyFund.percentage
                        }%</div>
                        <div class="metric-label">Emergency Fund</div>
                    </div>
                </div>
            </div>
        `;

    // Insert metrics section after summary section
    summarySection.parentNode.insertBefore(
      metricsSection,
      summarySection.nextSibling
    );
  }

  updateCategoryBreakdown() {
    // Add category breakdown to the budget tab
    const budgetContent = document.getElementById("budget-content");

    // Create category breakdown section
    const categorySection = document.createElement("div");
    categorySection.className = "dashboard-item category-breakdown";
    categorySection.style.marginTop = "2rem";
    categorySection.style.gridColumn = "1 / -1";

    categorySection.innerHTML = `
            <h4>Spending by Category</h4>
            <table class="category-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>% of Budget</th>
                        <th>Monthly Trend</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.spendingByCategory
                      .map((category) => {
                        const trendIcon =
                          category.trend > 0
                            ? "↑"
                            : category.trend < 0
                            ? "↓"
                            : "→";
                        const trendClass =
                          category.trend > 0
                            ? "negative"
                            : category.trend < 0
                            ? "positive"
                            : "neutral";

                        return `
                            <tr>
                                <td>
                                    <span class="category-tag ${category.category.toLowerCase()}">${
                          category.category
                        }</span>
                                </td>
                                <td>$${category.amount.toLocaleString()}</td>
                                <td>${category.percentage}%</td>
                                <td class="${trendClass}">${Math.abs(
                          category.trend
                        )}% ${trendIcon}</td>
                                <td>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${
                                          category.percentage
                                        }%"></div>
                                    </div>
                                </td>
                            </tr>
                        `;
                      })
                      .join("")}
                </tbody>
            </table>
        `;

    // Add category section to budget content
    budgetContent.appendChild(categorySection);
  }

  updateBudgetProgress() {
    // Add budget progress to the budget tab
    const budgetContent = document.getElementById("budget-content");

    // Create budget progress section
    const progressSection = document.createElement("div");
    progressSection.className = "dashboard-item budget-progress";
    progressSection.style.marginTop = "2rem";
    progressSection.style.gridColumn = "1 / -1";

    // Get current date info for progress calculation
    const today = new Date();
    const daysInMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    ).getDate();
    const dayOfMonth = today.getDate();
    const monthProgress = Math.round((dayOfMonth / daysInMonth) * 100);

    progressSection.innerHTML = `
            <h4>Monthly Budget Progress</h4>
            <div class="budget-progress-container">
                <div class="budget-progress-item">
                    <div class="progress-header">
                        <span>Month Progress</span>
                        <span>${monthProgress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${monthProgress}%"></div>
                    </div>
                </div>
                <div class="budget-progress-item">
                    <div class="progress-header">
                        <span>Spending Progress</span>
                        <span>64%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 64%"></div>
                    </div>
                </div>
                <div class="budget-progress-item">
                    <div class="progress-header">
                        <span>Income Progress</span>
                        <span>75%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill success" style="width: 75%"></div>
                    </div>
                </div>
                <div class="budget-progress-item">
                    <div class="progress-header">
                        <span>Savings Progress</span>
                        <span>82%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill success" style="width: 82%"></div>
                    </div>
                </div>
            </div>
        `;

    // Add progress section to budget content
    budgetContent.appendChild(progressSection);
  }

  initEventListeners() {
    // Add event listeners for transaction filtering
    document
      .getElementById("category-filter")
      .addEventListener("change", () => this.renderTransactions());
    document
      .getElementById("date-filter")
      .addEventListener("change", () => this.renderTransactions());

    // Add event listener for transaction search
    const searchInput = document.getElementById("transaction-search");
    searchInput.addEventListener("input", () => this.renderTransactions());

    // Add event listeners for transaction sorting
    document
      .querySelectorAll(".transaction-table th.sortable")
      .forEach((th) => {
        th.addEventListener("click", () => {
          const column = th.dataset.sort;

          // Toggle sort direction or set to asc if clicking a new column
          if (this.sortConfig.column === column) {
            this.sortConfig.direction =
              this.sortConfig.direction === "asc" ? "desc" : "asc";
          } else {
            this.sortConfig.column = column;
            this.sortConfig.direction = "asc";
          }

          // Update sort indicators
          document
            .querySelectorAll(".transaction-table th.sortable")
            .forEach((header) => {
              header.classList.remove("active", "asc", "desc");
              header.querySelector(".sort-icon").textContent = "";
            });

          th.classList.add("active", this.sortConfig.direction);
          th.querySelector(".sort-icon").textContent =
            this.sortConfig.direction === "asc" ? "↑" : "↓";

          // Re-render transactions with new sort
          this.renderTransactions();
        });
      });

    // Add event listeners for pagination
    let currentPage = 1;
    document.getElementById("pagination-prev").addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        this.renderTransactions(currentPage);
      }
    });

    document.getElementById("pagination-next").addEventListener("click", () => {
      const totalItems = this.getFilteredTransactions().length;
      const totalPages = Math.ceil(totalItems / 10);

      if (currentPage < totalPages) {
        currentPage++;
        this.renderTransactions(currentPage);
      }
    });
  }
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create the dashboard manager with a slight delay to ensure other elements are loaded
  setTimeout(() => {
    window.dashboardManager = new DashboardManager();
  }, 500);
});
// Initialize Supabase client
const supabaseUrl = "https://zasmrwoujnxxrmmezldh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inphc21yd291am54eHJtbWV6bGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NjgzMTUsImV4cCI6MjA1OTM0NDMxNX0.DmB7HwUXfJuU2Mo-swGQSzK03sTt_YLIA3ifJuIEpdc";
const { createClient } = supabase;
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Example: Check if user is authenticated
async function checkUser() {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();
  if (user) {
    console.log("User is logged in:", user);
    // Update UI for logged-in state
    return user;
  } else {
    console.log("User is not logged in");
    // Update UI for logged-out state
    return null;
  }
}

async function signUpUser(email, password) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing up:", error.message);
    return null;
  }

  return data;
}

async function signInUser(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.error("Error signing in:", error.message);
    return null;
  }

  return data;
}

async function signOutUser() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Error signing out:", error.message);
  }
}

async function fetchExpenseCategories() {
  const { data, error } = await supabaseClient
    .from("expense_categories")
    .select("*");

  if (error) {
    console.error("Error fetching expense categories:", error.message);
    return [];
  }

  return data;
}

async function addExpense(categoryId, amount, date, description) {
  const { data, error } = await supabaseClient.from("expenses").insert([
    {
      category_id: categoryId,
      amount: amount,
      transaction_date: date,
      description: description,
    },
  ]);

  if (error) {
    console.error("Error adding expense:", error.message);
    return null;
  }

  return data;
}
