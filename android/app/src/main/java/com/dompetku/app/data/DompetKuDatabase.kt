package com.dompetku.app.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.dompetku.app.model.Transaction

@Database(entities = [Transaction::class], version = 1, exportSchema = false)
abstract class DompetKuDatabase : RoomDatabase() {
    abstract fun transactionDao(): TransactionDao

    companion object {
        @Volatile
        private var INSTANCE: DompetKuDatabase? = null

        fun getDatabase(context: Context): DompetKuDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    DompetKuDatabase::class.java,
                    "dompetku_database"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
