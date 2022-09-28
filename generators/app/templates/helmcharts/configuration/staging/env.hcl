# APPLICATION FLAGS
LOG_LEVEL="INFO"
DEPLOYMENT_NAME="staging"
ENV_NAME="staging"
LOCAL_SETTINGS_MODULES=
ENABLE_STATSD=1
STATSD_HOST='influxdb-1.placer.team'
STATSD_PORT=8125
STATSD_METRIC_PREFIX="staging.services.<%=projectNameUnderscore%>"

# CONNECTION STRINGS
SENTRY_EVENTS_LOG_LEVEL='ERROR'
SENTRY_DSN={{ key "dashboard_be_services/staging/sentry_dsn_server" }}
SENTRY_ENV="<%=projectNameHyphen%>-staging"

CORS_ORIGINS = "*"

