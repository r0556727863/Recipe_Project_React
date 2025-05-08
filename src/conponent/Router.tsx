import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./AppLayout"
import AddRecipe from "./recipe/AddRecipe"
import Home from "./Home"
import RecipeList from "./recipe/RecipeList"
import EditRecipe from "./recipe/EditRecipe"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/AddRecipe",
        element: <AddRecipe />,
      },
      {
        path: "/RecipeList",
        element: <RecipeList />,
      },
      {
        path: "/edit-recipe/:id",
        element: <EditRecipe />,
      },
    ],
  },
])
