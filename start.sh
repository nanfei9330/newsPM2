#!/bin/bash
echo "service start..."

pm2 start ./bin/news

#设定最大cpu占用率
maxCpuRate=70

while [ true ]
do
	#获取进程pid
	pid=`ps -ef|grep 'newsPM2/bin'|awk 'NR==1{print $2}'`
	echo "newsPID="$pid
	#判断nodejs进程是否存在
	if [ ! $pid ]
	then
		echo "can not found nodejs"
		break
	fi
	#cpu占用率
	cpuRate=`ps -p $pid -o pcpu|grep -v CPU|cut -d . -f 1|awk '{print $1}'`
	echo "cpu="$cpuRate
	#如果占用率超过70%，则重启nodejs服务
	if [ "$cpuRate" -gt "$maxCpuRate" ]
	then
		echo "cpu占用率超过70% nodejs服务将重启"
		pm2 restart all
	else 
		echo "nodejs运行正常，20s稍后重新检测...."
	fi
	echo "===================================="
	#等待20s
	sleep 20s
done


