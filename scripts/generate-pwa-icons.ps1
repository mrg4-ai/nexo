Add-Type -AssemblyName System.Drawing
$outputDirectory = Join-Path $PSScriptRoot "..\public\icons"
[System.IO.Directory]::CreateDirectory($outputDirectory) | Out-Null

function New-NexoIcon([int]$size, [string]$name, [bool]$maskable) {
  $bitmap = [System.Drawing.Bitmap]::new($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($(if ($maskable) { "#090d0c" } else { "#61d3a5" })))
  if ($maskable) {
    $inset = [int]($size * 0.16); $diameter = $size - ($inset * 2)
    $markBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#61d3a5"))
    $graphics.FillEllipse($markBrush, $inset, $inset, $diameter, $diameter); $markBrush.Dispose()
  }
  $fontSize = [single]($size * $(if ($maskable) { 0.43 } else { 0.58 }))
  $font = [System.Drawing.Font]::new("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml("#082116"))
  $format = [System.Drawing.StringFormat]::new(); $format.Alignment = "Center"; $format.LineAlignment = "Center"
  $graphics.DrawString("n", $font, $textBrush, [System.Drawing.RectangleF]::new(0, -[single]($size * 0.04), $size, $size), $format)
  $bitmap.Save((Join-Path $outputDirectory $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $format.Dispose(); $textBrush.Dispose(); $font.Dispose(); $graphics.Dispose(); $bitmap.Dispose()
}

New-NexoIcon 192 "icon-192.png" $false
New-NexoIcon 512 "icon-512.png" $false
New-NexoIcon 512 "maskable-512.png" $true
New-NexoIcon 180 "apple-touch-icon.png" $false
