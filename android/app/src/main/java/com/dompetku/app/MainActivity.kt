package com.dompetku.app

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
import kotlinx.coroutines.launch
import java.util.UUID

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = DompetKuDatabase.getDatabase(this)
        val dao = database.transactionDao()

        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF059669), // Emerald
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
}

enum class Screen(val title: String) {
    SUMMARY("Ringkasan"),
    TRANSACTIONS("Transaksi"),
    REPORTS("Laporan")
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DompetKuApp(dao: com.dompetku.app.data.TransactionDao) {
    val coroutineScope = rememberCoroutineScope()
    var currentScreen by remember { mutableStateOf(Screen.SUMMARY) }
    val transactions by dao.getAllTransactions().collectAsState(initial = emptyList())
    val totalIncome by dao.getTotalIncome().collectAsState(initial = 0L)
    val totalExpense by dao.getTotalExpense().collectAsState(initial = 0L)
    val balance = totalIncome - totalExpense

    var showAddDialog by remember { mutableStateOf(false) }
    var selectedType by remember { mutableStateOf(TransactionType.EXPENSE) }

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface) {
                NavigationBarItem(
                    selected = currentScreen == Screen.SUMMARY,
                    onClick = { currentScreen = Screen.SUMMARY },
                    icon = { Icon(Icons.Default.Dashboard, contentDescription = "Ringkasan") },
                    label = { Text("Ringkasan") }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.TRANSACTIONS,
                    onClick = { currentScreen = Screen.TRANSACTIONS },
                    icon = { Icon(Icons.Default.Receipt, contentDescription = "Transaksi") },
                    label = { Text("Transaksi") }
                )
                NavigationBarItem(
                    selected = currentScreen == Screen.REPORTS,
                    onClick = { currentScreen = Screen.REPORTS },
                    icon = { Icon(Icons.Default.PieChart, contentDescription = "Laporan") },
                    label = { Text("Laporan") }
                )
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    selectedType = TransactionType.EXPENSE
                    showAddDialog = true
                },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.white
            ) {
                Icon(Icons.Default.Add, contentDescription = "Tambah Transaksi")
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding).fillMaxSize()) {
            when (currentScreen) {
                Screen.SUMMARY -> {
                    // Dashboard Screen
                    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                        Text(
                            text = "DompetKu",
                            style = MaterialTheme.typography.headlineMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        // Balance Card
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF047857))
                        ) {
                            Column(modifier = Modifier.padding(20.dp)) {
                                Text("Total Saldo Otomatis", color = Color.White.copy(alpha = 0.8f))
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    "Rp ${"%,d".format(balance).replace(',', '.')}",
                                    style = MaterialTheme.typography.headlineLarge,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.height(16.dp))
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text("Masuk: Rp ${"%,d".format(totalIncome).replace(',', '.')}", color = Color(0xFFA7F3D0))
                                    Text("Keluar: Rp ${"%,d".format(totalExpense).replace(',', '.')}", color = Color(0xFFFECDD3))
                                }
                            }
                        }
                    }
                }
                Screen.TRANSACTIONS -> {
                    // Transaction Screen
                    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                        Text("Riwayat Transaksi", style = MaterialTheme.typography.titleLarge)
                        Spacer(modifier = Modifier.height(8.dp))
                        // Items list
                    }
                }
                Screen.REPORTS -> {
                    // Reports Screen
                    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                        Text("Laporan Bulanan", style = MaterialTheme.typography.titleLarge)
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }
        }
    }
}
