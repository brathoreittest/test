#!/bin/bash
date_formate=`date +"%m-%d-%y"`
pattern_match1='server ='
pattern_match2='no-task'
pattern_match3='always send'
pattern_match4='do not check'
replace_pattern1='server = https://172.16.2.42/glpi/plugins/fusioninventory/'
replace_pattern2='tasks = inventory,deploy,inventory'
replace_pattern3='force = 1'
replace_pattern4='no-ssl-check = 1'
apt -y install dmidecode hwdata ucf hdparm
apt -y install perl libuniversal-require-perl libwww-perl libparse-edid-perl
apt -y install libproc-daemon-perl libfile-which-perl libhttp-daemon-perl
apt -y install libxml-treepp-perl libyaml-perl libnet-cups-perl libnet-ip-perl
apt -y install libdigest-sha-perl libsocket-getaddrinfo-perl libtext-template-perl
sleep 30;
cd /opt/
wget http://debian.fusioninventory.org/downloads/fusioninventory-agent_2.4-2_all.deb
dpkg -i fusioninventory-agent_2.4-2_all.deb
cp /etc/fusioninventory/agent.cfg /opt/agent.cfg_$date_formate
sed -i '/'"$pattern_match1"'/s/^/#/g' /etc/fusioninventory/agent.cfg
sed -i '/'"$pattern_match2"'/s/^/#/g' /etc/fusioninventory/agent.cfg

sed -i '/'"$pattern_match1"'/i '"$replace_pattern1"'' /etc/fusioninventory/agent.cfg
sed  -i '/'"$pattern_match2"'/i '"$replace_pattern2"'' /etc/fusioninventory/agent.cfg

sed  -i '/'"$pattern_match3"'/i '"$replace_pattern3"'' /etc/fusioninventory/agent.cfg

sed  -i '/'"$pattern_match4"'/i '"$replace_pattern4"'' /etc/fusioninventory/agent.cfg

