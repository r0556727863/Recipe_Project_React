import axios from "axios"
import { makeAutoObservable, runInAction, toJS } from "mobx"

export type User = {
  Id: number
  Name: string
  Password: string
  Phone: string
  UserName: string
  Email: string
  Tz: string
}

export type Ingrident = {
  Name: string
  Count: number | string
  Type: string
}

export type Instruction = {
  Id?: number
  Name: string
}

export type Recipise = {
  Id: number
  Name: string
  Instructions: Instruction[]
  Difficulty: number | string
  Duration: number
  Img: string
  Ingridents: Ingrident[]
  UserId: number
  Categoryid: number
  Description: string
}

class RecipeStore {
  recipes: Recipise[] = []
  selectedRecipe: Recipise | null = null
  loading = false
  error: string | null = null
  categories: any[] = []

  constructor() {
    makeAutoObservable(this)
    this.fetchCategories()
  }

  async fetchCategories() {
    try {
      const response = await axios.get("http://localhost:8080/api/category")
      runInAction(() => {
        this.categories = response.data || []
        console.log("Categories loaded:", this.categories)
      })
    } catch (err) {
      console.error("Error fetching categories:", err)
      runInAction(() => {
        this.categories = [
          { Id: 1, Name: "חלבי" },
          { Id: 2, Name: "בשרי" },
          { Id: 3, Name: "פרווה" },
          { Id: 4, Name: "קינוחים" },
          { Id: 5, Name: "מאפים" },
        ]
      })
    }
  }

  async getRecipe() {
    this.loading = true
    this.error = null
    try {
      const res = await axios.get("http://localhost:8080/api/recipe")
      runInAction(() => {
        this.recipes = res.data || []
        console.log("Recipes loaded:", this.recipes)
      })
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || "Failed to load recipes"
        console.error("Error loading recipes:", error)
        this.recipes = [] // Ensure recipes is always an array
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  async getRecipeById(id: number) {
    try {
      const res = await axios.get(`http://localhost:8080/api/recipe/${id}`)
      return res.data
    } catch (error: any) {
      console.error("Error fetching recipe by ID:", error)
      throw error
    }
  }

  async addRecipe(recipe: any) {
    try {
      console.log("Adding recipe:", recipe)
      const res = await axios.post("http://localhost:8080/api/recipe", recipe)
      const newRecipe = res.data

      runInAction(() => {
        // Add the new recipe to the recipes array
        this.recipes.push(newRecipe)
      })

      return newRecipe
    } catch (error: any) {
      console.error("Error adding recipe:", error)
      throw error
    }
  }

  async editRecipe(recipe: any) {
    try {
      console.log("Editing recipe before API call:", recipe)

      // Make a deep copy of the recipe to avoid reference issues
      const cleanRecipe = toJS(recipe)

      // Log the data being sent to the server
      const res = await axios.post(`http://localhost:8080/api/recipe/edit`, cleanRecipe)
      const updatedRecipe = res.data

      console.log("Server response:", updatedRecipe)

      runInAction(() => {
        const index = this.recipes.findIndex((r) => r.Id === recipe.Id)
        if (index !== -1) {
          this.recipes = [...this.recipes.slice(0, index), updatedRecipe, ...this.recipes.slice(index + 1)]
        }

        // Update selected recipe if it's the one being edited
        if (this.selectedRecipe && this.selectedRecipe.Id === recipe.Id) {
          this.selectedRecipe = { ...updatedRecipe }
        }
      })

      // Refresh recipes from server to ensure we have the latest data
      await this.getRecipe() // ודא שאתה מחכה לסיום הפונקציה
      console.log("Recipes after fetching from server:", this.recipes)
      console.log("Server response++++++:", updatedRecipe)
      return updatedRecipe
    } catch (error: any) {
      console.error("Error editing recipe:", error)
      throw error
    }
  }

  async deleteRecipe(id: number, userId: number) {
    try {
      const recipe = this.recipes.find((recipe) => recipe.Id === id)

      if (!recipe) {
        throw new Error("Recipe not found")
      }

      if (recipe.UserId !== userId) {
        throw new Error("You are not authorized to delete this recipe")
      }

      await axios.post(`http://localhost:8080/api/recipe/delete/${id}`)

      runInAction(() => {
        // Update local state after successful deletion
        this.recipes = this.recipes.filter((recipe) => recipe.Id !== id)

        // Clear selected recipe if it was deleted
        if (this.selectedRecipe && this.selectedRecipe.Id === id) {
          this.selectedRecipe = null
        }
      })

      alert("המתכון נמחק בהצלחה")
    } catch (error: any) {
      console.error("Error deleting recipe:", error)
      alert(error.message || "שגיאה במחיקת המתכון")
      throw error
    }
  }

  selectRecipe(recipe: Recipise | null) {
    if (recipe) {
      // Find the most up-to-date version of the recipe
      const freshRecipe = this.recipes.find((r) => r.Id === recipe.Id)

      // Create a deep copy to avoid reference issues
      if (freshRecipe) {
        this.selectedRecipe = JSON.parse(JSON.stringify(freshRecipe))
      } else {
        this.selectedRecipe = JSON.parse(JSON.stringify(recipe))
      }
    } else {
      this.selectedRecipe = null
    }
  }
}

export const recipeStore = new RecipeStore()
