Write-Host "Testing ZenoPay API Integration..." -ForegroundColor Green

# Test 1: Initiate Payment
Write-Host "`nTest 1: Initiating Payment" -ForegroundColor Green
$paymentBody = @{
    accountId = "zp51883"
    phoneNumber = "0746359369"
    amount = 200.0
} | ConvertTo-Json

$paymentResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/initiate-payment" `
    -Method Post `
    -ContentType "application/json" `
    -Body $paymentBody

Write-Host "Payment Response:" -ForegroundColor Yellow
$paymentResponse | ConvertTo-Json

# Wait for 2 seconds
Start-Sleep -Seconds 2

# Test 2: Check Order Status
Write-Host "`nTest 2: Checking Order Status" -ForegroundColor Green
$orderBody = @{
    orderId = "ORDER_ID"
} | ConvertTo-Json

$orderResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/check-order-status" `
    -Method Post `
    -ContentType "application/json" `
    -Body $orderBody

Write-Host "Order Status Response:" -ForegroundColor Yellow
$orderResponse | ConvertTo-Json

# Test 3: Webhook Simulation
Write-Host "`nTest 3: Simulating Webhook" -ForegroundColor Green
$webhookBody = @{
    order_id = "test_order_123"
    status = "completed"
    amount = 200.0
    timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

$webhookResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/webhook" `
    -Method Post `
    -ContentType "application/json" `
    -Body $webhookBody

Write-Host "Webhook Response:" -ForegroundColor Yellow
$webhookResponse | ConvertTo-Json

Write-Host "`nAPI Tests Completed" -ForegroundColor Green 