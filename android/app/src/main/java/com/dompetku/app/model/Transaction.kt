package com.dompetku.app.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.text.NumberFormat
import java.util.Locale

enum class TransactionType {
    INCOME, EXPENSE
}

@Entity(tableName = "transactions")
data class Transaction(
    @PrimaryKey
    val id: String,
    val type: TransactionType,
    val amount: Long,
    val date: String, // YYYY-MM-DD
    val time: String? = null,
    val categoryId: String,
    val note: String = "",
    val createdAt: Long = System.currentTimeMillis()
) {
    fun formatRupiah(): String {
        val format = NumberFormat.getCurrencyInstance(Locale("id", "ID"))
        format.maximumFractionDigits = 0
        return format.format(amount)
    }
}
