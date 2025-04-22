#!/bin/sh
set -e

# Проверяем обязательные переменные окружения
for var in TS_CONF_PATH TS_LOG_PATH TS_TORR_DIR TS_PORT; do
    if [ -z "$(eval echo \$$var)" ]; then
        echo "Error: $var is not set"
        exit 1
    fi
done

# Создаем необходимые директории
for dir in "${TS_CONF_PATH}" "${TS_TORR_DIR}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
    fi
done

# Создаем файл лога, если он не существует
if [ ! -f "${TS_LOG_PATH}" ]; then
    touch "${TS_LOG_PATH}"
fi

# Формируем базовые флаги
FLAGS="--path $TS_CONF_PATH --logpath $TS_LOG_PATH --port $TS_PORT --torrentsdir $TS_TORR_DIR"

# Добавляем опциональные флаги
[ "${TS_HTTPAUTH:-0}" = "1" ] && FLAGS="${FLAGS} --httpauth"
[ "${TS_RDB:-0}" = "1" ] && FLAGS="${FLAGS} --rdb"
[ "${TS_DONTKILL:-0}" = "1" ] && FLAGS="${FLAGS} --dontkill"
[ "${TS_EN_SSL:-0}" = "1" ] && FLAGS="${FLAGS} --ssl"
[ -n "${TS_SSL_PORT}" ] && FLAGS="${FLAGS} --sslport ${TS_SSL_PORT}"

echo "Running with: ${FLAGS}"

exec torrserver $FLAGS
