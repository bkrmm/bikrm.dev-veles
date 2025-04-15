// transactions.js - Dedicated functionality for the Transactions page

class TransactionsManager {
  constructor() {
    this.transactionData = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.sortConfig = {
      column: "date",
      direction: "desc",
    };
    this.filterConfig = {
      category: "all",
      account: "all",
      dateRange: "month",
      searchQuery: "",
    };

    // Initialize the transactions page
    this.init();
  }

  init() {
    // Generate sample transaction data
    this.generateTransactionData();

    // Initialize event listeners
    this.initEventListeners();

    // Render transactions
    this.renderTransactions();

    // Initialize user menu dropdown
    this.initUserMenu();
    
    // Initialize transaction form
    this.initTransactionForm();
  }

  initUserMenu() {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userDropdown = document.getElementById("userDropdown");

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener("click", () => {
        userDropdown.classList.toggle("active");
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", (event) => {
        if (!userMenuBtn.contains(event.target) && !userDropdown.contains(event.target)) {
          userDropdown.classList.remove("active");
        }
      });
    }
  }

  initTransactionForm() {
    const transactionForm = document.getElementById("transaction-form");
    const transactionType = document.getElementById("transaction-type");
    const transactionCategory = document.getElementById("transaction-category");
    
    // Update category options based on transaction type
    transactionType.addEventListener("change", () => {
      const isIncome = transactionType.value === "income";
      
      // Clear existing options
      transactionCategory.innerHTML = "";
      
      if (isIncome) {
        // Add income categories
        const incomeOptions = ["Income", "Salary", "Bonus", "Freelance", "Interest", "Dividends", "Other"];
        incomeOptions.forEach(category => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          transactionCategory.appendChild(option);
        });
      } else {
        // Add expense categories
        const expenseOptions = ["Housing", "Transportation", "Food", "Utilities", "Entertainment", "Other"];
        expenseOptions.forEach(category => {
          const option = document.createElement("option");
          option.value = category;
          option.textContent = category;
          transactionCategory.appendChild(option);
        });
      }
    });
    
    // Handle form submission
    transactionForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Get form values
      const date = new Date(document.getElementById("transaction-date").value);
      const description = document.getElementById("transaction-description").value;
      const amount = parseFloat(document.getElementById("transaction-amount").value);
      const type = document.getElementById("transaction-type").value;
      const category = document.getElementById("transaction-category").value;
      const account = document.getElementById("transaction-account").value;
      
      // Create new transaction object
      const newTransaction = {
        id: this.transactionData.length + 1,
        date: date,
        description: description,
        category: category,
        amount: type === "income" ? amount : -amount,
        account: account
      };
      
      // Add to transaction data
      this.transactionData.unshift(newTransaction);
      
      // Reset form
      transactionForm.reset();
      
      // Set default date to today
      document.getElementById("transaction-date").valueAsDate = new Date();
      
      // Re-render transactions
      this.currentPage = 1;
      this.renderTransactions();
      
      // Show success message
      this.showNotification("Transaction added successfully!");
    });
    
    // Set default date to today
    document.getElementById("transaction-date").valueAsDate = new Date();
  }
  
  showNotification(message) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  initEventListeners() {
    // Sort functionality
    const sortableHeaders = document.querySelectorAll(".sortable");
    sortableHeaders.forEach((header) => {
      header.addEventListener("click", () => {
        const column = header.dataset.sort;
        this.handleSort(column);
      });
    });

    // Filter functionality
    const categoryFilter = document.getElementById("category-filter");
    const accountFilter = document.getElementById("account-filter");
    const dateFilter = document.getElementById("date-filter");
    const searchInput = document.getElementById("transaction-search");

    categoryFilter.addEventListener("change", () => {
      this.filterConfig.category = categoryFilter.value;
      this.currentPage = 1;
      this.renderTransactions();
    });

    accountFilter.addEventListener("change", () => {
      this.filterConfig.account = accountFilter.value;
      this.currentPage = 1;
      this.renderTransactions();
    });

    dateFilter.addEventListener("change", () => {
      this.filterConfig.dateRange = dateFilter.value;
      this.currentPage = 1;
      this.renderTransactions();
    });

    searchInput.addEventListener("input", () => {
      this.filterConfig.searchQuery = searchInput.value.toLowerCase();
      this.currentPage = 1;
      this.renderTransactions();
    });

    // Pagination functionality
    const prevButton = document.getElementById("pagination-prev");
    const nextButton = document.getElementById("pagination-next");

    prevButton.addEventListener("click", () => {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.renderTransactions();
      }
    });

    nextButton.addEventListener("click", () => {
      const filteredData = this.getFilteredTransactions();
      const totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
      if (this.currentPage < totalPages) {
        this.currentPage++;
        this.renderTransactions();
      }
    });
  }

  handleSort(column) {
    // Update sort configuration
    if (this.sortConfig.column === column) {
      // Toggle direction if same column
      this.sortConfig.direction = this.sortConfig.direction === "asc" ? "desc" : "asc";
    } else {
      // Set new column and default to ascending
      this.sortConfig.column = column;
      this.sortConfig.direction = "asc";
    }

    // Update UI to show sort direction
    const sortableHeaders = document.querySelectorAll(".sortable");
    sortableHeaders.forEach((header) => {
      const headerColumn = header.dataset.sort;
      const sortIcon = header.querySelector(".sort-icon");

      // Remove active class and icon from all headers
      header.classList.remove("active", "asc", "desc");
      sortIcon.textContent = "";

      // Add active class and icon to current sort column
      if (headerColumn === this.sortConfig.column) {
        header.classList.add("active", this.sortConfig.direction);
        sortIcon.textContent = this.sortConfig.direction === "asc" ? "↑" : "↓";
      }
    });

    // Re-render transactions with new sort
    this.renderTransactions();
  }

  getFilteredTransactions() {
    return this.transactionData.filter((transaction) => {
      // Filter by category
      if (this.filterConfig.category !== "all" && transaction.category !== this.filterConfig.category) {
        return false;
      }

      // Filter by account
      if (this.filterConfig.account !== "all" && transaction.account !== this.filterConfig.account) {
        return false;
      }

      // Filter by date range
      const today = new Date();
      const transactionDate = new Date(transaction.date);
      
      if (this.filterConfig.dateRange === "today") {
        if (transactionDate.toDateString() !== today.toDateString()) {
          return false;
        }
      } else if (this.filterConfig.dateRange === "week") {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        if (transactionDate < weekAgo) {
          return false;
        }
      } else if (this.filterConfig.dateRange === "month") {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        if (transactionDate < monthAgo) {
          return false;
        }
      } else if (this.filterConfig.dateRange === "year") {
        const yearAgo = new Date(today);
        yearAgo.setFullYear(today.getFullYear() - 1);
        if (transactionDate < yearAgo) {
          return false;
        }
      }

      // Filter by search query
      if (this.filterConfig.searchQuery) {
        const searchQuery = this.filterConfig.searchQuery.toLowerCase();
        const descriptionMatch = transaction.description.toLowerCase().includes(searchQuery);
        const categoryMatch = transaction.category.toLowerCase().includes(searchQuery);
        const accountMatch = transaction.account.toLowerCase().includes(searchQuery);
        const amountMatch = Math.abs(transaction.amount).toString().includes(searchQuery);

        if (!(descriptionMatch || categoryMatch || accountMatch || amountMatch)) {
          return false;
        }
      }

      return true;
    });
  }

  getSortedTransactions(transactions) {
    return [...transactions].sort((a, b) => {
      const column = this.sortConfig.column;
      const direction = this.sortConfig.direction === "asc" ? 1 : -1;

      if (column === "date") {
        return (new Date(a.date) - new Date(b.date)) * direction;
      } else if (column === "amount") {
        return (a.amount - b.amount) * direction;
      } else {
        // For string columns (description, category, account)
        const valueA = a[column].toLowerCase();
        const valueB = b[column].toLowerCase();
        if (valueA < valueB) return -1 * direction;
        if (valueA > valueB) return 1 * direction;
        return 0;
      }
    });
  }

  renderTransactions() {
    const tbody = document.getElementById("transaction-body");
    const filteredData = this.getFilteredTransactions();
    const sortedData = this.getSortedTransactions(filteredData);

    // Calculate pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = Math.min(start + this.itemsPerPage, sortedData.length);
    const paginatedData = sortedData.slice(start, end);

    // Update pagination info
    document.getElementById("pagination-start").textContent =
      sortedData.length > 0 ? start + 1 : 0;
    document.getElementById("pagination-end").textContent = end;
    document.getElementById("pagination-total").textContent = sortedData.length;

    // Update pagination buttons
    document.getElementById("pagination-prev").disabled = this.currentPage === 1;
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
        year: "numeric",
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
        <td><span class="category-tag ${transaction.category.toLowerCase()}">${transaction.category}</span></td>
        <td class="${amountClass}">${transaction.amount >= 0 ? "+" : "-"}${formattedAmount}</td>
        <td>${transaction.account}</td>
      `;

      tbody.appendChild(row);
    });

    // Show empty state if no transactions
    if (paginatedData.length === 0) {
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `
        <td colspan="5" class="empty-state">
          <p>No transactions found matching your filters.</p>
          <button id="reset-filters" class="btn-secondary">Reset Filters</button>
        </td>
      `;
      tbody.appendChild(emptyRow);

      // Add event listener to reset filters button
      document.getElementById("reset-filters").addEventListener("click", () => {
        document.getElementById("category-filter").value = "all";
        document.getElementById("account-filter").value = "all";
        document.getElementById("date-filter").value = "month";
        document.getElementById("transaction-search").value = "";

        this.filterConfig = {
          category: "all",
          account: "all",
          dateRange: "month",
          searchQuery: "",
        };

        this.currentPage = 1;
        this.renderTransactions();
      });
    }
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

    // Generate 100 transactions for the past 90 days
    for (let i = 0; i < 100; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
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
}

// Initialize the transactions manager when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const transactionsManager = new TransactionsManager();
});