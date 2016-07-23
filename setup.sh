n="
"
# From http://stackoverflow.com/a/246128
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Redis
redis (){
    slave=false;
    echo "Enter the desired password for the Redis instance:"
    read -s password
    password=$password | sha256sum
    echo "Is this a slave?"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) slave=1; break;;
            No ) slave=0; break;;
        esac
    done
    slave_text="";
    if [[ $slave -eq 1 ]]; then
        echo "Enter the Master IP address:"
        read master_ip
        echo "Enter the Redis Master password:"
        read -s master_password
        slave_text="slaveof $master_ip 6379
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
    stats=1;
    stats_text="stats disable";
    echo "Please enter the IP address:"
    read initial_ip
    echo "Please enter the port:"
    read initial_port
    i=1
    web_servers="server web$i $initial_ip:$initial_port check$n"
    more_web_servers=1;

    while [ $more_web_servers -eq 1 ]
    do
        echo "Would you like to add another web server?"
        select yn in "Yes" "No"; do
            case $yn in
                Yes )
                    echo "Please enter the IP address:"
                    read repeat_ip
                    echo "Please enter the port:"
                    read repeat_port;
                    ((i++))
                    web_servers+="    server web$i $repeat_ip:$repeat_port check$n";
                    break;;
                No ) more_web_servers=0; break;;
            esac
        done
    done

    echo "Do you want to turn HAProxy stats on?"
    select yn in "Yes" "No"; do
        case $yn in
            Yes ) stats=1; break;;
            No ) stats=0; break;;
        esac
    done
    if [[ $stats -eq 1 ]]; then
        echo "Enter the URL for stats:"
        read stats_uri
        echo "Please enter a user to access the stats page"
        echo "Please enter the Username:"
        read username
        echo "Please enter the Password:"
        read -s password
        users="stats auth $username:$password $n"
        more_users=1;

        while [ $more_users -eq 1 ]
        do
            echo "Would you like to add another user?"
            select yn in "Yes" "No"; do
                case $yn in
                    Yes )
                        echo "Please enter the Username:"
                        read username
                        echo "Please enter the Password:"
                        read -s password
                        users+="    stats auth $username:$password $n"
                        break;;
                    No ) more_users=0; break;;
                esac
            done
        done

        stats_text="stats enable
    stats uri $stats_uri
    stats realm Strictly\ Private
    $users"
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
    $web_servers $n" > "/etc/haproxy/haproxy.cfg"
}

# web / cron
web (){
    cron_dir="$DIR/dist/cron";
    cron_content="/usr/local/bin/node $cron_dir";
    echo "Please enter the Redis Master IP:"
    read redis_master_ip
    echo "Please enter the Redis Master Auth password:"
    read -s redis_master_password
    echo "Please enter the HAProxy IP address:"
    read HAProxy_IP
    echo "{
    \"redis\": {
        \"current_environment\": \"prod\",
        \"environments\": {
            \"prod\": {
                \"host\": \"$redis_master_ip\",
                \"port\": \"6379\",
                \"password\": \"$redis_master_password\"
            }
        }
    },
    \"haproxy\": {
        \"IP\": \"$HAProxy_IP\"
    }
}" > "$DIR/web.config.json"

    echo "Before continuing, we need to build the solution.
Have you done this, or would you like to now? (yes or no)"
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

echo "StackNews setup script
-----------
Is this a Redis server, HAProxy server or web/cron server?"

select option in "Redis" "Web" "HAProxy"; do
    case $option in
        Redis ) redis; break;;
        Web ) web; break;;
        HAProxy ) haproxy; break;;
    esac
done
