export type Workspace = "personal" | "business";
export type TransactionType = "income" | "expense" | "transfer";

export interface BaseRecord { id: string; createdAt: string; updatedAt: string }
export interface Account extends BaseRecord { name: string; type: "bank" | "cash" | "wallet" | "savings" | "other"; initialBalance: number; currency: "PEN"; archivedAt?: string }
export interface Transaction extends BaseRecord { type: TransactionType; amount: number; category: string; accountId: string; destinationAccountId?: string; date: string; description: string; notes?: string; recurring?: boolean; workspace: Workspace }
export interface Budget extends BaseRecord { category: string; limit: number }
export interface SavingGoal extends BaseRecord { name: string; targetAmount: number; currentAmount: number; targetDate: string; contributions: { id: string; amount: number; date: string }[] }
export interface Asset extends BaseRecord { name: string; value: number; kind: string }
export interface Liability extends BaseRecord { name: string; value: number; kind: string }
export interface ProductCostItem { id: string; name: string; amount: number; type: "material" | "labor" | "other" }
export interface Product extends BaseRecord { name: string; salePrice: number; sales: number; status: "active" | "paused"; costs: ProductCostItem[] }
export interface InventoryItem extends BaseRecord { productId: string; quantity: number; unitCost: number; minimumStock: number; adjustments: { id: string; quantity: number; date: string }[] }
export interface RecurringTransaction extends BaseRecord { type: "income" | "expense"; amount: number; day: number; description: string; active: boolean }
export interface MonthlySnapshot extends BaseRecord { month: string; assets: number; liabilities: number }
export interface Business extends BaseRecord { name: string }
export interface UserProfile extends BaseRecord { name: string }
export interface Settings { currency: "PEN"; appearance: "dark"; monthlySavingsTarget: number; schemaVersion: 2; selectedPeriod: string; guideCompleted: boolean; categories:{personal:string[];business:string[]} }

export interface AppData {
  profile: UserProfile | null;
  accounts: Account[]; transactions: Transaction[]; budgets: Budget[]; goals: SavingGoal[];
  assets: Asset[]; liabilities: Liability[]; products: Product[]; inventory: InventoryItem[];
  recurring: RecurringTransaction[]; snapshots: MonthlySnapshot[]; business: Business; settings: Settings;
}
