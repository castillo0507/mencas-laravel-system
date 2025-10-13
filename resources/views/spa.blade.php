<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Student & Faculty Management System</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
        }
        
        #app {
            min-height: 100vh;
        }
        
        /* Custom styles for the app */
        .page-link {
            border-radius: 8px !important;
            margin: 0 2px !important;
            border: 1px solid #dee2e6 !important;
            color: #667eea !important;
            padding: 8px 12px !important;
            transition: all 0.2s ease !important;
        }
        
        .page-link:hover {
            background-color: #667eea !important;
            border-color: #667eea !important;
            color: white !important;
            transform: translateY(-1px);
        }
        
        .page-item.active .page-link {
            background-color: #667eea !important;
            border-color: #667eea !important;
            color: white !important;
            font-weight: 600;
        }
        
        .page-item.disabled .page-link {
            background-color: #f8f9fa !important;
            border-color: #dee2e6 !important;
            color: #6c757d !important;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- Loading spinner while React loads -->
        <div class="d-flex justify-content-center align-items-center" style="min-height: 100vh;">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted">Loading Admin</p>
            </div>
        </div>
    </div>

    <!-- Axios for API calls -->
    <script src="https://cdn.jsdelivr.net/npm/axios@1.1.2/dist/axios.min.js"></script>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- React App -->
    <script src="{{ mix('js/app.js') }}"></script>
    
    <script>
        // Set up axios defaults
        axios.defaults.baseURL = window.location.origin;
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        // Handle axios errors globally
        axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401) {
                    // Unauthorized - redirect to login
                    localStorage.removeItem('auth_token');
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    </script>
</body>
</html>