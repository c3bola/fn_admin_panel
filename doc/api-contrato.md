
# OpenAPI Contract & Backend Integration

This document outlines the API specification and architectural contract governing the communication between the Angular frontend and the planned Node.js backend for the Fortnite Brasil Admin Dashboard.

## 1. Design-First API Strategy

To ensure a decoupled, scalable, and predictable architecture, the project utilizes an **OpenAPI 3.0** specification. This contract defines all HTTP methods, endpoints, request payloads, and data models before backend implementation, serving as the single source of truth for both frontend developers and backend engineers.

The complete and unified specification is located in the project repository at `public/openapi/openapi.yaml`.

## 2. API Domains & Endpoints Overview

The API is partitioned into five distinct logical domains, reflecting the core management modules of the application:

-   **Groups Domain (`/groups`):**
    
    -   `GET /groups`: Retrieves all monitored Telegram groups.
        
    -   `GET /groups/{groupId}/config`: Fetches granular settings, active filters, and message templates.
        
    -   `PUT /groups/{groupId}/config`: Updates group-wide moderation settings.
        
    -   `GET /groups/{groupId}/blacklist`: Lists blacklist entries (URLs, keywords, user IDs).
        
    -   `POST /groups/{groupId}/blacklist`: Atomically adds a new blacklist rule.
        
    -   `DELETE /groups/{groupId}/blacklist/{itemId}`: Removes a specific blacklist entry.
        
-   **Members Domain (`/members`):**
    
    -   `GET /members`: Fetches paginated member lists with filters for search terms and roles (`Admin`, `VIP`, `Membro`).
        
    -   `GET /members/{memberId}`: Retrieves full profile data for a specific user.
        
    -   `GET /members/{memberId}/timeline`: Fetches chronological audit logs of user interactions.
        
    -   `GET /members/{memberId}/notes`: Lists internal staff annotations.
        
    -   `POST /members/{memberId}/notes`: Appends a new private staff note.
        
    -   `DELETE /members/{memberId}/notes/{noteId}`: Deletes a specific staff note.
        
    -   `POST /members/{memberId}/actions`: Triggers direct moderation actions (`warn`, `mute`, `ban`) synced to Telegram.
        
-   **VIP Hub / Clubinho Domain (`/vips`):**
    
    -   `GET /vips`: Lists active subscribers, plan distributions, and estimated revenue.
        
    -   `PUT /vips/{memberId}`: Updates core subscription details (PIX tier plan, expiration date, daily broadcast limits).
        
    -   `PATCH /vips/{memberId}/benefits`: Atomically toggles individual subscriber privileges (e.g., custom tags, slow-mode bypass, locked group access).
        
-   **Announcements Domain (`/announcements`):**
    
    -   `GET /announcements`: Retrieves announcement history, including sent, scheduled, and draft states.
        
    -   `POST /announcements`: Enqueues a new broadcast with specified targets (groups, channels, or private bot chats) and optional scheduling.
        
    -   `DELETE /announcements/{id}`: Cancels a scheduled broadcast or deletes a draft.
        
-   **Giveaways Domain (`/giveaways`):**
    
    -   `GET /giveaways`: Lists active and historical giveaways.
        
    -   `POST /giveaways`: Creates a new giveaway entity and generates the Telegram preview card.
        
    -   `DELETE /giveaways/{id}`: Removes a giveaway.
        
    -   `POST /giveaways/{id}/draw`: Triggers the server-side randomization algorithm to select and announce winners.
        

## 3. Data Flow & Future Integration Strategy

During the initial development phase, the application reads and writes data through local TypeScript mocks (`src/app/core/mocks/`) mirroring the schemas defined in the OpenAPI contract.

Transitioning to the production Node.js backend requires replacing the mock service implementations with standard Angular `HttpClient` calls pointing to the base API server (`http://localhost:3000/api/v1`), leveraging the exact DTO (Data Transfer Object) models documented in the YAML specification.