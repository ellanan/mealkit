# MealKit

MealKit is a full-stack meal planning web app which allows users to create recipes, plan meals, collaborate on meal plans, auto generate grocery lists.

MealKit is built type-safe from frontend to backend, thanks to Prisma, Apollo Server, GreaphQL CodeGen.

# Link to the app:

https://mealkit.ellanan.com/

## Features:

- Create/search recipes and add recipes to meal plan
- Collaborate on meal plan with family/friends
- Load starter recipes if user does not have any existing recipes
- Auto generate grocery lists based on the meals planned for the selected date range
- Populate popular recipes based on frequncy from the last 30 days
- Snappy/instantaneous user interactions using Apollo Client to provide optimistic responses by manipulating client-side data cache
- Tailored responsive UI that looks great on both mobile and desktop

## Flow Chart

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/mealKitFlowChart.jpg)

## Screenshots

Home Page:

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/homePage.png)

Meal Plan Page (desktop):

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/mealPlanDesktop.png)

Meal Plan Page (mobile):

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/mealPlanMobile2.png)

Groceries Page:

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/groceryList2.png)

Recipes Page:

![This is an image](https://github.com/ellanan/mealkit/blob/main/src/images/readme/recipesPage.png)

## Technologies used

Frontend:

- React
- TypeScript
- HTML
- Tailwind

Backend:

- PostgreSQL
- Prisma
- Heroku

Others:

- GraphQL

Authentication:

- Auth0
