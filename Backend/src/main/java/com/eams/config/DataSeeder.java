package com.eams.config;

import com.eams.model.*;
import com.eams.repo.AssetRepository;
import com.eams.repo.StockItemRepository;
import com.eams.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final StockItemRepository stockItemRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public DataSeeder(UserRepository userRepository,
                      AssetRepository assetRepository,
                      StockItemRepository stockItemRepository,
                      PasswordEncoder passwordEncoder,
                      JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.stockItemRepository = stockItemRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        migrateLegacyCategories();
        seedUsers();
        seedAssets();
        seedStock();
    }

    private void migrateLegacyCategories() {
        try {
            jdbcTemplate.execute("ALTER TABLE assets DROP CONSTRAINT IF EXISTS assets_category_check");
            jdbcTemplate.update(
                    "UPDATE assets SET category = 'LAPTOPS' WHERE category IN ('IT_EQUIPMENT')");
            jdbcTemplate.update(
                    "UPDATE assets SET category = 'OFFICE_FURNITURE' WHERE category IN ('FURNITURE')");
            jdbcTemplate.update(
                    "UPDATE assets SET category = 'PRINTERS' WHERE category IN ('MACHINERY')");
            jdbcTemplate.update(
                    "UPDATE assets SET category = 'NETWORKING_DEVICES' WHERE category IN ('VEHICLE', 'OFFICE_SUPPLIES', 'OTHER')");
        } catch (Exception ignored) {
        }
    }

    private void seedUsers() {
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
        } catch (Exception ignored) {
        }

        seedUser("admin", "admin@nexora.io", "Nexora@2026", "Cabdiraxmaan Nuur Cali",
                "Administration", Role.ADMIN);
        seedUser("assets", "assets@nexora.io", "Assets@2026", "Maxamed Cabdullaahi Xasan",
                "Operations", Role.ASSET_MANAGER);
        seedUser("inventory", "inventory@nexora.io", "Stock@2026", "Axmed Ibraahim Warsame",
                "Finance", Role.INVENTORY_OFFICER);
        seedUser("technician", "technician@nexora.io", "Tech@2026", "Hodan Maxamed Nuur",
                "IT", Role.TECHNICIAN);
        seedUser("auditor", "auditor@nexora.io", "Audit@2026", "Fadumo Axmed Maxamed",
                "Finance", Role.AUDITOR);
    }

    private void seedUser(String username, String email, String password, String fullName,
                          String department, Role role) {
        userRepository.findByUsername(username).ifPresentOrElse(user -> {
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setDepartment(department);
            user.setProfileImage("/profiles/" + username + ".webp");
            user.setRole(role);
            userRepository.save(user);
        }, () -> {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setFullName(fullName);
            user.setDepartment(department);
            user.setProfileImage("/profiles/" + username + ".webp");
            user.setRole(role);
            userRepository.save(user);
        });
    }

    private void seedAssets() {
        try {
            Integer legacy = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM assets WHERE notes = 'Seeded sample asset'", Integer.class);
            if (legacy != null && legacy > 0) {
                jdbcTemplate.update("DELETE FROM assignments");
                jdbcTemplate.update("DELETE FROM maintenance_records");
                jdbcTemplate.update("DELETE FROM assets WHERE notes = 'Seeded sample asset'");
            }
        } catch (Exception ignored) {
        }

        if (assetRepository.count() > 0) {
            return;
        }
        createAsset("Dell OptiPlex Desktop", "SN-PC-001", AssetCategory.COMPUTERS,
                new BigDecimal("950.00"), "IT Lab - Desk 01", AssetStatus.AVAILABLE);
        createAsset("HP EliteBook 840 G9", "SN-LT-002", AssetCategory.LAPTOPS,
                new BigDecimal("1350.00"), "IT Department", AssetStatus.AVAILABLE);
        createAsset("Dell UltraSharp 27 Monitor", "SN-MN-003", AssetCategory.MONITORS,
                new BigDecimal("420.00"), "Finance Floor", AssetStatus.AVAILABLE);
        createAsset("HP LaserJet Pro M404", "SN-PR-004", AssetCategory.PRINTERS,
                new BigDecimal("380.00"), "Administration Print Room", AssetStatus.AVAILABLE);
        createAsset("Dell PowerEdge R740 Server", "SN-SV-005", AssetCategory.SERVERS,
                new BigDecimal("8500.00"), "Server Room A", AssetStatus.AVAILABLE);
        createAsset("Cisco Catalyst 2960 Switch", "SN-NW-006", AssetCategory.NETWORKING_DEVICES,
                new BigDecimal("1200.00"), "Network Closet", AssetStatus.AVAILABLE);
        createAsset("Ergonomic Office Desk", "SN-FN-007", AssetCategory.OFFICE_FURNITURE,
                new BigDecimal("320.00"), "HR Office", AssetStatus.AVAILABLE);
    }

    private void createAsset(String name, String serial, AssetCategory category,
                             BigDecimal cost, String location, AssetStatus status) {
        Asset asset = new Asset();
        asset.setName(name);
        asset.setSerialNumber(serial);
        asset.setCategory(category);
        asset.setPurchaseDate(LocalDate.now().minusMonths(4));
        asset.setPurchaseCost(cost);
        asset.setWarrantyExpiry(LocalDate.now().plusYears(2));
        asset.setLocation(location);
        asset.setStatus(status);
        asset.setNotes("Nexora Technologies managed asset");
        asset.setAssetCode("TEMP");
        asset.setQrCodeData("TEMP");
        asset.setBarcodeData("TEMP");
        asset = assetRepository.save(asset);

        String code = String.format("G2-%06d", 100000 + asset.getId());
        asset.setAssetCode(code);
        asset.setQrCodeData("/api/public/assets/by-code/" + code);
        asset.setBarcodeData(code);
        assetRepository.save(asset);
    }

    private void seedStock() {
        try {
            Integer legacy = jdbcTemplate.queryForObject(
                    "SELECT COUNT(*) FROM stock_items WHERE sku LIKE 'SKU-PAPER%' OR sku LIKE 'SKU-HDMI%' OR sku LIKE 'SKU-TONER%' OR sku LIKE 'SKU-USB%'",
                    Integer.class);
            if (legacy != null && legacy > 0) {
                jdbcTemplate.update("DELETE FROM stock_transactions");
                jdbcTemplate.update(
                        "DELETE FROM stock_items WHERE sku LIKE 'SKU-PAPER%' OR sku LIKE 'SKU-HDMI%' OR sku LIKE 'SKU-TONER%' OR sku LIKE 'SKU-USB%'");
            }
        } catch (Exception ignored) {
        }

        if (stockItemRepository.count() > 0) {
            return;
        }
        createStock("Cat6 Ethernet Cable 5m", "SKU-NET-001", 80, 25, "Network Store", "Networking patch cables");
        createStock("Laptop Docking Station", "SKU-LT-002", 18, 8, "IT Store", "USB-C docking hubs");
        createStock("Printer Toner HP 58A", "SKU-PR-003", 4, 12, "Print Room", "Low stock demo item");
        createStock("HDMI to DisplayPort Adapter", "SKU-MN-004", 35, 15, "IT Store", "Monitor adapters");
        createStock("Wireless Keyboard & Mouse Kit", "SKU-PC-005", 22, 10, "IT Store", "Desktop peripherals");
    }

    private void createStock(String name, String sku, int qty, int min, String location, String desc) {
        StockItem item = new StockItem();
        item.setItemName(name);
        item.setSku(sku);
        item.setQuantity(qty);
        item.setMinimumStock(min);
        item.setLocation(location);
        item.setDescription(desc);
        stockItemRepository.save(item);
    }
}
