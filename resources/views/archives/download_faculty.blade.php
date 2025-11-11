<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Faculty {{ $archive->id }}</title>
  <style>
    body { font-family: DejaVu Sans, Arial, sans-serif; color: #222; }
    .header { text-align: center; margin-bottom: 20px; }
    h1 { font-size: 18px; margin: 0 0 6px; }
    .section { margin-bottom: 12px; }
    .section h2 { font-size: 14px; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .field { margin-bottom: 6px; }
    .label { font-weight: bold; width: 160px; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Faculty Information Report</h1>
    <div style="font-size:12px; margin-top:6px;">Archive ID: {{ $archive->id }} &middot; Type: {{ $archive->resource_type }}</div>
  </div>

  <div class="section">
    <h2>Personal & Employment Information</h2>
    @php $d = (array) ($data ?? []); @endphp
    <div class="field"><span class="label">Employee ID:</span> {{ $d['employee_id'] ?? $d['id'] ?? '' }}</div>
    @php
      $full = trim(($d['first_name'] ?? '') . ' ' . ($d['middle_name'] ?? '') . ' ' . ($d['last_name'] ?? ''));
      if (!empty($d['extension_name'])) $full .= ' ' . $d['extension_name'];
    @endphp
    <div class="field"><span class="label">Full Name:</span> {{ $full }}</div>
    <div class="field"><span class="label">Email:</span> {{ $d['email'] ?? '' }}</div>
    <div class="field"><span class="label">Phone:</span> {{ $d['phone'] ?? '' }}</div>
  <div class="field"><span class="label">Gender:</span> {{ isset($d['gender']) ? ucfirst($d['gender']) : '' }}</div>
  <div class="field"><span class="label">Emergency Contact:</span> {{ $d['emergency_contact'] ?? '' }}</div>
    <div class="field"><span class="label">Position:</span> {{ $d['position'] ?? '' }}</div>
    <div class="field"><span class="label">Department:</span> {{ $d['department_name'] ?? $d['department'] ?? '' }}</div>
    <div class="field"><span class="label">Status:</span> {{ isset($d['is_active']) ? ($d['is_active'] ? 'Active' : 'Inactive') : (isset($d['status']) ? ucfirst($d['status']) : '') }}</div>
  </div>

</body>
</html>
