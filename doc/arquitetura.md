
# System Architecture & Technical Decisions

This document outlines the core architectural choices and technical strategies employed in the frontend development of the Fortnite Brasil Admin Dashboard. The project embraces modern Angular paradigms to ensure a scalable, maintainable, and highly performant codebase.

## 1. Core Philosophy: Modern Angular

The application is built using **Angular (v22+)**, migrating away from traditional, heavy paradigms in favor of a lightweight, reactive, and modular approach. The architecture is designed to handle complex UI states—such as deep dashboard navigation, dynamic modals, and real-time data previews—without relying on overly complex third-party state management libraries.

## 2. Standalone Components Architecture

We completely bypassed traditional `NgModules` in favor of **Standalone Components**.

-   **Reduced Boilerplate:** Each component declares its own dependencies (imports), making it entirely self-contained and easier to test or move.
    
-   **Granular Lazy Loading:** Routing is configured to lazy-load standalone components directly (`loadComponent`), significantly reducing the initial bundle size and improving the Time to Interactive (TTI).
    
-   **Clearer Dependency Graph:** By importing only what is strictly necessary (e.g., specific Lucide icons or CommonModule directives) directly into the component's `@Component` decorator, the dependency tree remains transparent and predictable.
    

## 3. Reactive State Management with Angular Signals

To handle synchronous UI state and cross-component communication, the project heavily utilizes **Angular Signals** instead of `BehaviorSubject` or complex RxJS pipelines.

-   **Local Component State:** Signals are used extensively within components to manage UI states such as open/closed dropdowns, active tabs, and modal visibility (e.g., `isModalOpen = signal(false)`). This provides fine-grained reactivity, triggering change detection only where the signal is consumed.
    
-   **Global UI State (`LayoutService`):** A centralized `LayoutService` uses Signals to manage the responsive sidebar state across the application.
```
@Injectable({ providedIn: 'root' })
export class LayoutService {
  isSidebarOpen = signal(true);
  toggleSidebar() { this.isSidebarOpen.update(v => !v); }
}
```
-   By injecting this service into the `GlobalTopbar` and `GlobalSidebar`, the UI reacts instantly to state changes without the overhead of observables or async pipes.
    

## 4. UI & Styling Strategy: Tailwind CSS

The visual layer is powered entirely by **Tailwind CSS**, adhering to a utility-first methodology.

-   **Zero Custom CSS Files:** With the exception of global structural resets (like custom scrollbars), all styling—including complex states like hover, focus, and group-hover—is handled directly in the HTML templates.
    
-   **Dynamic Classes:** Tailwind's utility classes are dynamically bound to Angular Signals to manage responsive layouts and UI interactions (e.g., `[class.-translate-x-full]="!layoutService.isSidebarOpen()"`).
    
-   **Design System Consistency:** Brand colors (purples, pinks, yellows) and spacing scales are standardized through Tailwind, ensuring visual consistency across the dashboard.
    

## 5. Component & Directory Structure

The project follows a feature-driven folder structure, ensuring that business logic is kept close to its relevant UI components:

-   `/core/`: Contains singleton services, interceptors, and local data mocks (until backend integration).
    
-   `/features/`: The heart of the application, organized by business domain (`/community/members`, `/community/giveaways`, etc.). Each feature contains its own list, detail, and routing logic.
    
-   `/layout/`: Houses the global structural components (`GlobalTopbar`, `GlobalSidebar`) that persist across route changes.
    
-   `/shared/`: Reusable, agnostic UI components (`TextEditor`, `SharedTabs`) designed to be consumed by multiple features without creating circular dependencies.