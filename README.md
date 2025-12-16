
```
plugcore-chatbot
├─ api
│  ├─ .env
│  ├─ .env.example
│  ├─ .sequelizerc
│  ├─ eslint.config.js
│  ├─ index.js
│  ├─ package.json
│  └─ src
│     ├─ app.js
│     ├─ config
│     │  ├─ config-example.json
│     │  └─ config.json
│     ├─ controllers
│     │  ├─ admin
│     │  └─ customer
│     │     └─ chat-controller.js
│     ├─ middlewares
│     │  ├─ error-handler.js
│     │  ├─ expose-services.js
│     │  ├─ user-agent.js
│     │  └─ user-tracking.js
│     ├─ migrations
│     │  ├─ 20250425125700-create-customer-bot-chats-table.js
│     │  ├─ 20250425125700-create-customers-events-table.js
│     │  ├─ 20250425125700-create-email-errors-table.js
│     │  ├─ 20250425125700-create-emails-table.js
│     │  ├─ 20250425125700-create-event-occurrences-table.js
│     │  ├─ 20250425125700-create-event-prices-table.js
│     │  ├─ 20250425125700-create-events-table.js
│     │  ├─ 20250425125700-create-promoters-spots-table.js
│     │  ├─ 20250425125700-create-promoters-table.js
│     │  ├─ 20250425125700-create-sent-emails-table.js
│     │  ├─ 20250425125700-create-spots-table.js
│     │  ├─ 20250425125700-create-towns-table.js
│     │  ├─ 20250425125700-create-users-table.js
│     │  ├─ 20250430122500-create-customer-activation-tokens-table.js
│     │  ├─ 20250430122500-create-customer-credentials.js
│     │  ├─ 20250430122500-create-customer-reset-password-tokens-table.js
│     │  ├─ 20250430122500-create-customers-table.js
│     │  ├─ 20250430122500-create-promoter-activation-tokens-table.js
│     │  ├─ 20250430122500-create-promoter-credentials.js
│     │  ├─ 20250430122500-create-promoter-reset-password-tokens-table.js
│     │  ├─ 20250430122500-create-promoters-spots-table.js
│     │  ├─ 20250430122500-create-user-activation-tokens-table.js
│     │  ├─ 20250430122500-create-user-credentials.js
│     │  ├─ 20250430122500-create-user-reset-password-tokens-table.js
│     │  ├─ 20250508112300-create-bots-table.js
│     │  ├─ 20250508112300-create-customers-bots-table.js
│     │  └─ 20250508112300-create-event-categories-table.js
│     ├─ models
│     │  ├─ mongoose
│     │  │  ├─ chat.js
│     │  │  └─ index.js
│     │  └─ sequelize
│     ├─ routes
│     │  ├─ admin
│     │  │  ├─ bots.js
│     │  │  ├─ cards.js
│     │  │  ├─ customer-bot-chats.js
│     │  │  ├─ customers-bots.js
│     │  │  ├─ customers-events.js
│     │  │  ├─ customers.js
│     │  │  ├─ email-errors.js
│     │  │  ├─ emails.js
│     │  │  ├─ event-categories.js
│     │  │  ├─ event-occurrences.js
│     │  │  ├─ event-prices.js
│     │  │  ├─ events.js
│     │  │  ├─ faqs.js
│     │  │  ├─ features-titles.js
│     │  │  ├─ hero.js
│     │  │  ├─ languages.js
│     │  │  ├─ promoters-spots.js
│     │  │  ├─ promoters.js
│     │  │  ├─ sent-emails.js
│     │  │  ├─ spots.js
│     │  │  ├─ subscription-forms.js
│     │  │  ├─ towns.js
│     │  │  ├─ user-credentials.js
│     │  │  └─ users.js
│     │  ├─ customer
│     │  │  └─ chats.js
│     │  └─ index.js
│     └─ services
│        └─ openai-service.js
├─ client
│  ├─ admin
│  └─ customer
│     ├─ .env
│     ├─ .env.example
│     ├─ app.css
│     ├─ eslint.config.js
│     ├─ images
│     │  ├─ airpods
│     │  ├─ helpful
│     │  ├─ hero.webp
│     │  ├─ remind
│     │  └─ text
│     │     └─ go_iphone__rgcqxe88k6y6_large.png
│     ├─ index.html
│     ├─ package.json
│     ├─ pages
│     │  └─ home.html
│     ├─ src
│     │  ├─ components
│     │  │  ├─ chatbot-component.js
│     │  │  ├─ hello-world-component.js
│     │  │  └─ page-component.js
│     │  └─ index.js
│     └─ vite.config.js
├─ package.json
└─ proxy.js

```