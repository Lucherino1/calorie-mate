type TJson =
  | string
  | number
  | boolean
  | null
  | { [key: string]: TJson | undefined }
  | TJson[]

type TDatabase = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: TJson
          extensions?: TJson
        }
        Returns: TJson
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      dashboard: {
        Row: {
          date: string
          id: string
          meals: TJson[]
          userId: string | null
          waterAmount: number
        }
        Insert: {
          date: string
          id?: string
          meals: TJson[]
          userId?: string | null
          waterAmount: number
        }
        Update: {
          date?: string
          id?: string
          meals?: TJson[]
          userId?: string | null
          waterAmount?: number
        }
        Relationships: [
          {
            foreignKeyName: 'Dashboard_user_id_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          id: string
          isVegan: boolean | null
          name: string
          nutritionDetails: TJson
          type: string
        }
        Insert: {
          id?: string
          isVegan?: boolean | null
          name: string
          nutritionDetails: TJson
          type: string
        }
        Update: {
          id?: string
          isVegan?: boolean | null
          name?: string
          nutritionDetails?: TJson
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bodyDetails: TJson
          email: string
          firstName: string
          id: string
          lastName: string
          role: string
          targetNutritionDetails: TJson
          targetNutritionDetailsByMeal: TJson
        }
        Insert: {
          bodyDetails: TJson
          email: string
          firstName: string
          id: string
          lastName: string
          role?: string
          targetNutritionDetails: TJson
          targetNutritionDetailsByMeal: TJson
        }
        Update: {
          bodyDetails?: TJson
          email?: string
          firstName?: string
          id?: string
          lastName?: string
          role?: string
          targetNutritionDetails?: TJson
          targetNutritionDetailsByMeal?: TJson
        }
        Relationships: []
      }
      recipes: {
        Row: {
          description: string | null
          id: string
          image: string | null
          ingredients: TJson
          isVegan: boolean | null
          name: string
          portionWeight: number
          type: string
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          ingredients: TJson
          isVegan?: boolean | null
          name: string
          portionWeight: number
          type: string
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          ingredients?: TJson
          isVegan?: boolean | null
          name?: string
          portionWeight?: number
          type?: string
        }
        Relationships: []
      }
      'user-products': {
        Row: {
          id: string
          isUnderReview: boolean | null
          isVegan: boolean | null
          name: string
          nutritionDetails: TJson
          type: string
          userId: string | null
        }
        Insert: {
          id?: string
          isUnderReview?: boolean | null
          isVegan?: boolean | null
          name: string
          nutritionDetails: TJson
          type: string
          userId?: string | null
        }
        Update: {
          id?: string
          isUnderReview?: boolean | null
          isVegan?: boolean | null
          name?: string
          nutritionDetails?: TJson
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user-products_user_id_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      'user-recipes': {
        Row: {
          description: string | null
          id: string
          image: string | null
          ingredients: TJson
          isUnderReview: boolean | null
          isVegan: boolean | null
          name: string
          portionWeight: number
          type: string
          userId: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          ingredients: TJson
          isUnderReview?: boolean | null
          isVegan?: boolean | null
          name: string
          portionWeight: number
          type: string
          userId?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          ingredients?: TJson
          isUnderReview?: boolean | null
          isVegan?: boolean | null
          name?: string
          portionWeight?: number
          type?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'user-recipes_user_id_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}