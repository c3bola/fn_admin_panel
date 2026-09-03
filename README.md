# Fortnite Brasil – Community Admin Dashboard

A modern, high-performance administrative web application built to manage a large-scale gaming community on Telegram. This dashboard serves as the central hub for community managers to oversee bots, moderate groups, manage VIP subscriptions, broadcast announcements, and orchestrate automated giveaways.

Built with scalability and user experience in mind, the project leverages the latest Angular features to deliver a responsive, reactive, and maintainable interface.

## 🚀 Tech Stack & Architecture

This project is built using a modern frontend ecosystem, prioritizing performance, state predictability, and modularity:

-   **Framework:** Angular (v22+) utilizing **Standalone Components** for a modular and boilerplate-free architecture.
    
-   **State Management:** **Angular Signals** for fine-grained, reactive state control across components without the overhead of RxJS subscriptions.
    
-   **Styling:** **Tailwind CSS** for utility-first, highly customizable, and responsive design.
    
-   **Icons:** **Lucide Angular** for consistent, lightweight, and scalable iconography.
    
-   **API Contract:** Design-first approach using **OpenAPI 3.0** to ensure seamless future integration with a Node.js backend.
    

## ✨ Core Features

-   **Bot & Group Management:** Monitor active Telegram bots, configure group rules (anti-spam, anti-flood), and manage blacklists.
    
-   **Member Moderation:** View member timelines, track community interactions, apply warnings/bans, and maintain internal staff notes.
    
-   **VIP Subscription Hub (Clubinho):** Track active, expiring, and inactive subscriptions. Manage individual member benefits (e.g., custom tags, priority support, daily broadcast limits).
    
-   **Broadcasts & Announcements:** Compose rich text messages, schedule dispatches, and target specific groups, channels, or bots.
    
-   **Automated Giveaways:** Create visual giveaway cards, configure prize details, track participants, and execute draws with Telegram preview integration.
    

## 📁 Documentation Hub

To explore the technical decisions, business rules, and API contracts, refer to the detailed documentation below:

-   **[1. System Architecture & Technical Decisions](https://www.google.com/search?q=doc/arquitetura.md)** _Deep dive into the use of Standalone Components, Signals, and the responsive layout service._
    
-   **[2. Modules & Business Logic](https://www.google.com/search?q=doc/modulos.md)** _Detailed breakdown of each feature, including VIP rules, moderation workflows, and custom components (e.g., TextEditor)._
    
-   **[3. OpenAPI Contract (API Specification)](https://www.google.com/search?q=doc/api-contrato.md)** _The complete YAML specification bridging the Angular frontend with the planned Node.js backend ecosystem._
    

## 🛠️ Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
    
-   [Angular CLI](https://angular.io/cli)
    

### Installation

1.  Clone the repository:

```
git clone https://github.com/your-username/fortnite-brasil-admin.git
cd fortnite-brasil-admin
```

2. Install dependencies:
```
npm install
```

3. Run the development server:

```
ng serve
```
 Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
    

_Note: The current iteration relies on local mock data (`src/app/core/mocks/`) for UI/UX development and testing. Full backend integration is outlined in the OpenAPI contract._

If you are satisfied with this README structure for your portfolio, let me know and we will move directly to the creation of the **`doc/arquitetura.md`** file.