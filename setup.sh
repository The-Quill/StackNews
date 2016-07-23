n = "
"
# From http://stackoverflow.com/a/246128
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "StackNews setup script
-----------
Is this a Redis server, HAProxy server or web/cron server? $n"

select option in "Redis" "Web" "HAProxy"; do
    case $option in
        Redis ) redis(); break;;
        Web ) web(); break;;
        HAProxy ) haproxy(); break;;
    esac
done

# Redis
redis (){
    slave = false;
    echo "Enter the desired password for the Redis instance:"
    read -s password
    password = $password | sha256sum
    echo "Is this a slave?"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) $slave = true; break;;
            No ) $slave = false; break;;
        esac
    done
    slave_text = ""
    if [[ $slave ]]; then
        echo "Enter the Master IP address: $n"
        read master_ip
        echo "Enter the Redis Master password: $n"
        read -s master_password
        slave_text = "slaveof $master_ip 6379
        masterauth $master_password $n"
    fi
    echo "tcp-keepalive 60
#bind 127.0.0.1
maxmemory-policy noeviction
appendonly yes
appendfilename redis-staging-ao.aof
requirepass $password
$slave_text
" > "/etc/redis/redis.conf"
    echo "The password for Redis is $password"
    sudo service redis-server restart
}


# HAProxy
haproxy (){
    stats = false;
    stats_text = "stats disable";
    stats_text
    ip_addresses = ( "${ip_port()}" );
    more_web_servers = true;

    while [ $more_web_servers ]
    do
        echo "Would you like to add another web server?"
        select yn in "Yes" "No"; do
            case $yn in
                Yes ) ip_addresses += ( "${ip_port()}" ); break;;
                No ) $more_web_servers = false; break;;
            esac
        done
    done
    web_servers_text = ""
    for i in "${ip_addresses[@]}";do
        web_servers_text += "server web$i ${ip_addresses[$i]} check"
    done

    echo "Do you want to turn HAProxy stats on?"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) $stats = true; break;;
            No ) $stats = false; break;;
        esac
    done
    if [[ $stats ]]; then
        echo "Enter the URL for stats:$n"
        read stats_uri
        echo "Please enter a user to access the stats page$n"
        users = ( "${user_password()}" );
        more_users = true;

        while [ $more_users ]
        do
            echo "Would you like to add another user?"
            select yn in "Yes" "No"; do
                case $yn in
                    Yes ) users += ( "${user_password()}" ); break;;
                    No ) $more_users = false; break;;
                esac
            done
        done
        users_text = ""
        for i in "${users[@]}";do
            users_text += "${users[$i]} $n"
        done

        stats_text = "stats enable
stats uri $stats_uri
stats realm Strictly\ Private
$users_text"
    fi

    echo "global
    log 127.0.0.1 local0 notice
    maxconn 2000
    user haproxy
    group haproxy

defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    retries 3
    option redispatch
    timeout connect  5000
    timeout client  10000
    timeout server  10000

listen appname 0.0.0.0:80
    mode http
    $stats_text
    balance roundrobin
    option httpclose
    option forwardfor
    $web_servers_text $n" > "/etc/haproxy/haproxy.cfg"
}

# web / cron
web (){
    cron_dir = "$DIR/dist/cron/";
    cron_content = "/usr/local/bin/node $cron_dir";
    echo "Please enter the Redis Master IP: $n"
    read redis_master_ip
    echo "Please enter the Redis Master Auth password: $n"
    read -s redis_master_password
    echo "{
        \"current_environment\": \"prod\",
        \"environments\": {
            \"prod\": {
                \"host\": \"$redis_master_ip\",
                \"port\": \"6379\",
                \"password\": \"$redis_master_password\"
            }
        }
    }" > "$DIR/redis.json"

    echo "Before continuing, we need to build the solution.
Have you done this, or would you like to now? (yes or no)$n"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) gulp; break;;
            No ) break;;
        esac
    done

    if [ -f "$cron_dir/posts.js" ]
    then
        echo "$cron_content/posts.js" > "/etc/cron.hourly"
        echo "Posts CRON job added."
    fi
    if [ -f "$cron_dir/sites.js" ]
    then
        echo "$cron_content/sites.js" > "/etc/cron.daily"
        echo "Sites CRON job added."
    fi

    echo "start on filesystem
script
    $DIR/node_modules/.bin/forever start $DIR/dist/web/index.js
    echo \"Server service started\"
end script" > "/etc/init/web.conf"
    update-rc.d web defaults
}


# Misc prompting functions

ip_port (){
    echo "Please enter the IP address:$n"
    read IP
    echo "Please enter the port:$n"
    read PORT
    return "$IP:$PORT"
}
user_password (){
    echo "Please enter the Username:"
    read username
    echo "Please enter the Password:"
    read -s password
    return "stats auth $username:$password"
}
