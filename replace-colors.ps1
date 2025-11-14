# Color Replacement Script - Remove ALL purple/indigo colors
# Replace with emerald/teal/green theme

$files = Get-ChildItem -Path "." -Include *.tsx,*.ts,*.css,*.jsx,*.js -Recurse -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace purple with emerald
    $content = $content -replace 'purple-50', 'emerald-50'
    $content = $content -replace 'purple-100', 'emerald-100'
    $content = $content -replace 'purple-200', 'emerald-200'
    $content = $content -replace 'purple-300', 'emerald-300'
    $content = $content -replace 'purple-400', 'emerald-400'
    $content = $content -replace 'purple-500', 'emerald-500'
    $content = $content -replace 'purple-600', 'emerald-600'
    $content = $content -replace 'purple-700', 'emerald-700'
    $content = $content -replace 'purple-800', 'emerald-800'
    $content = $content -replace 'purple-900', 'emerald-900'
    
    # Replace indigo with teal
    $content = $content -replace 'indigo-50', 'teal-50'
    $content = $content -replace 'indigo-100', 'teal-100'
    $content = $content -replace 'indigo-200', 'teal-200'
    $content = $content -replace 'indigo-300', 'teal-300'
    $content = $content -replace 'indigo-400', 'teal-400'
    $content = $content -replace 'indigo-500', 'teal-500'
    $content = $content -replace 'indigo-600', 'teal-600'
    $content = $content -replace 'indigo-700', 'teal-700'
    $content = $content -replace 'indigo-800', 'teal-800'
    $content = $content -replace 'indigo-900', 'teal-900'
    
    # Replace violet with cyan
    $content = $content -replace 'violet-50', 'cyan-50'
    $content = $content -replace 'violet-100', 'cyan-100'
    $content = $content -replace 'violet-200', 'cyan-200'
    $content = $content -replace 'violet-300', 'cyan-300'
    $content = $content -replace 'violet-400', 'cyan-400'
    $content = $content -replace 'violet-500', 'cyan-500'
    $content = $content -replace 'violet-600', 'cyan-600'
    $content = $content -replace 'violet-700', 'cyan-700'
    $content = $content -replace 'violet-800', 'cyan-800'
    $content = $content -replace 'violet-900', 'cyan-900'
    
    # Replace fuchsia with pink
    $content = $content -replace 'fuchsia-50', 'pink-50'
    $content = $content -replace 'fuchsia-100', 'pink-100'
    $content = $content -replace 'fuchsia-200', 'pink-200'
    $content = $content -replace 'fuchsia-300', 'pink-300'
    $content = $content -replace 'fuchsia-400', 'pink-400'
    $content = $content -replace 'fuchsia-500', 'pink-500'
    $content = $content -replace 'fuchsia-600', 'pink-600'
    $content = $content -replace 'fuchsia-700', 'pink-700'
    $content = $content -replace 'fuchsia-800', 'pink-800'
    $content = $content -replace 'fuchsia-900', 'pink-900'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Color replacement complete! All purple/indigo/violet colors replaced with emerald/teal/cyan."
