package com.dompetku.app.model

import androidx.compose.ui.graphics.Color

data class Category(
    val id: String,
    val name: String,
    val type: TransactionType,
    val iconName: String,
    val color: Color
)

object CategoryData {
    val categories = listOf(
        // Pengeluaran
        Category("food", "Makanan & Minuman", TransactionType.EXPENSE, "restaurant", Color(0xFFF97316)),
        Category("transport", "Transportasi & Bensin", TransactionType.EXPENSE, "directions_car", Color(0xFF0EA5E9)),
        Category("shopping", "Belanja Kebutuhan", TransactionType.EXPENSE, "shopping_bag", Color(0xFFEC4899)),
        Category("bills", "Tagihan & Listrik", TransactionType.EXPENSE, "bolt", Color(0xFFEAB308)),
        Category("entertainment", "Hiburan & Langganan", TransactionType.EXPENSE, "movie", Color(0xFF8B5CF6)),
        Category("health", "Kesehatan & Obat", TransactionType.EXPENSE, "medical_services", Color(0xFFEF4444)),
        Category("education", "Pendidikan & Buku", TransactionType.EXPENSE, "school", Color(0xFF14B8A6)),
        Category("other_expense", "Pengeluaran Lain", TransactionType.EXPENSE, "more_horiz", Color(0xFF64748B)),

        // Pemasukan
        Category("salary", "Gaji Bulanan", TransactionType.INCOME, "work", Color(0xFF10B981)),
        Category("business", "Usaha & Dagang", TransactionType.INCOME, "storefront", Color(0xFF059669)),
        Category("freelance", "Proyek Lepas (Freelance)", TransactionType.INCOME, "laptop_mac", Color(0xFF06B6D4)),
        Category("investment", "Investasi & Dividen", TransactionType.INCOME, "trending_up", Color(0xFF6366F1)),
        Category("gift", "Hadiah / THR", TransactionType.INCOME, "card_giftcard", Color(0xFFD946EF)),
        Category("other_income", "Pemasukan Lain", TransactionType.INCOME, "add_circle", Color(0xFF3B82F6))
    )

    fun getCategoryById(id: String): Category {
        return categories.find { it.id == id } ?: Category(
            "unknown", "Lainnya", TransactionType.EXPENSE, "tag", Color(0xFF6B7280)
        )
    }
}
