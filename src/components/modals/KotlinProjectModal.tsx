import React, { useState } from 'react';
import {
  X,
  FileCode,
  Download,
  Copy,
  Check,
  Smartphone,
  FolderTree,
  Terminal,
  ExternalLink,
} from 'lucide-react';
import JSZip from 'jszip';

interface KotlinProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ANDROID_SOURCE_FILES: { path: string; name: string; language: string; content: string }[] = [
  {
    path: 'android/app/src/main/java/com/dompetku/app/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    content: `package com.dompetku.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.dompetku.app.data.DompetKuDatabase
import com.dompetku.app.model.Transaction
import com.dompetku.app.model.TransactionType

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = DompetKuDatabase.getDatabase(this)
        val dao = database.transactionDao()

        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF059669),
                    secondary = Color(0xFF0EA5E9),
                    tertiary = Color(0xFFF97316),
                    surface = Color(0xFFFFFFFF),
                    background = Color(0xFFF8FAFC)
                )
            ) {
                DompetKuApp(dao = dao)
            }
        }
    }
}`,
  },
  {
    path: 'android/app/src/main/java/com/dompetku/app/model/Transaction.kt',
    name: 'Transaction.kt',
    language: 'kotlin',
    content: `package com.dompetku.app.model

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
}`,
  },
  {
    path: 'android/app/src/main/java/com/dompetku/app/data/TransactionDao.kt',
    name: 'TransactionDao.kt',
    language: 'kotlin',
    content: `package com.dompetku.app.data

import androidx.room.*
import com.dompetku.app.model.Transaction
import kotlinx.coroutines.flow.Flow

@Dao
interface TransactionDao {
    @Query("SELECT * FROM transactions ORDER BY date DESC, createdAt DESC")
    fun getAllTransactions(): Flow<List<Transaction>>

    @Query("SELECT * FROM transactions WHERE date LIKE :monthPrefix || '%' ORDER BY date DESC")
    fun getTransactionsForMonth(monthPrefix: String): Flow<List<Transaction>>

    @Query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'INCOME'")
    fun getTotalIncome(): Flow<Long>

    @Query("SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'EXPENSE'")
    fun getTotalExpense(): Flow<Long>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTransaction(transaction: Transaction)

    @Update
    suspend fun updateTransaction(transaction: Transaction)

    @Delete
    suspend fun deleteTransaction(transaction: Transaction)

    @Query("DELETE FROM transactions WHERE id = :id")
    suspend fun deleteById(id: String)
}`,
  },
  {
    path: 'android/app/src/main/java/com/dompetku/app/data/DompetKuDatabase.kt',
    name: 'DompetKuDatabase.kt',
    language: 'kotlin',
    content: `package com.dompetku.app.data

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
}`,
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    language: 'kotlin',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

android {
    namespace = "com.dompetku.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.dompetku.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
}`,
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application
        android:allowBackup="true"
        android:label="DompetKu"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
  },
];

export const KotlinProjectModal: React.FC<KotlinProjectModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  if (!isOpen) return null;

  const currentFile = ANDROID_SOURCE_FILES[selectedFileIndex];

  const handleCopyCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Root files
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "DompetKu"
include(":app")`
      );

      zip.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}`
      );

      // gradle/libs.versions.toml
      zip.file(
        'gradle/libs.versions.toml',
        `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
room = "2.6.1"
ksp = "2.0.21-1.0.27"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }`
      );

      // app files
      ANDROID_SOURCE_FILES.forEach((f) => {
        const cleanPath = f.path.replace('android/', '');
        zip.file(cleanPath, f.content);
      });

      // README instructions
      zip.file(
        'README.md',
        `# DompetKu Android Native (Kotlin + Jetpack Compose)

## Cara Build APK:
1. Ekstrak ZIP ini ke komputer Anda.
2. Buka Android Studio -> Open -> pilih folder hasil ekstrak.
3. Tunggu Gradle Sync selesai.
4. Klik Build -> Build Bundle(s) / APK(s) -> Build APK(s).
5. File APK akan terbentuk di: app/build/outputs/apk/debug/app-debug.apk`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'DompetKu-Android-Native-Kotlin.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Gagal membuat ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Proyek Android Native (Kotlin + Compose)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  Siap Build APK
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Kode sumber lengkap Jetpack Compose & SQLite Room database
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body: Sidebar list of files + Code Viewer */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-3 overflow-y-auto space-y-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center gap-1.5">
              <FolderTree size={13} />
              <span>Struktur Berkas Kotlin</span>
            </div>

            {ANDROID_SOURCE_FILES.map((file, idx) => (
              <button
                key={file.path}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all ${
                  selectedFileIndex === idx
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                <FileCode size={14} className="shrink-0" />
                <span className="truncate">{file.name}</span>
              </button>
            ))}

            {/* Quick Build APK Guide */}
            <div className="mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-[11px] space-y-1.5 text-emerald-900 dark:text-emerald-200">
              <div className="font-bold flex items-center gap-1">
                <Terminal size={13} />
                <span>Kompilasi APK:</span>
              </div>
              <p className="leading-relaxed opacity-90">
                Buka di Android Studio, klik menu <b>Build &gt; Build APK(s)</b> atau jalankan{' '}
                <code className="bg-white/80 dark:bg-black/40 px-1 rounded font-mono">
                  ./gradlew assembleDebug
                </code>
              </p>
            </div>
          </div>

          {/* Code Viewer Panel */}
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900 text-slate-200">
            {/* Code Header Bar */}
            <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400 truncate">{currentFile.path}</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
              </button>
            </div>

            {/* Code Textarea / Display */}
            <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 select-text bg-slate-900">
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <p className="text-xs text-slate-500 hidden sm:block">
            Semua kode Kotlin dan Jetpack Compose telah siap untuk diimpor.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              Tutup
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Download size={15} />
              <span>{isZipping ? 'Menyiapkan ZIP...' : 'Download Proyek Android Studio (.ZIP)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
