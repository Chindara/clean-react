# PostProcessingScript.ps1

Param (
    [string]$FeatureName
)

$FeatureNameLowerCase = $FeatureName.Substring(0, 1).ToLower() + $FeatureName.Substring(1)

# Replace all occurrences of 'FeatureName' with the lowercase version where needed
Get-ChildItem -Recurse -Include *.cs, *.js, *.ts, *.html | ForEach-Object {
    (Get-Content $_.FullName) -replace "{{featureNameLowerCase}}", $FeatureNameLowerCase | Set-Content $_.FullName
}
