with open('users/views.py', 'r') as f:
    lines = f.readlines()

# Find the Add brokers section and update it
in_brokers = False
for i, line in enumerate(lines):
    if '# Add brokers' in line:
        in_brokers = True
    if in_brokers and 'result.append({' in line:
        # Find the end of this append (next })
        for j in range(i, min(i+20, len(lines))):
            if '})' in lines[j]:
                # Insert profile_picture handling before the })
                indent = '                '
                new_lines = [
                    indent + "'profile_picture': profile_pic,\n",
                ]
                # Also need to add profile_pic variable before the append
                # Find the line before result.append
                for k in range(i, 0, -1):
                    if 'for broker in brokers:' in lines[k]:
                        # Add profile_pic logic after this line
                        indent2 = '            '
                        pic_lines = [
                            indent2 + '# Get profile picture URL\n',
                            indent2 + 'profile_pic = ""\n',
                            indent2 + 'if broker.profile_picture:\n',
                            indent2 + '    try:\n',
                            indent2 + "        profile_pic = broker.profile_picture.url\n",
                            indent2 + '    except:\n',
                            indent2 + "        profile_pic = ''\n",
                        ]
                        lines[k+1:k+1] = pic_lines + lines[k+1:]
                        break
                # Now update the append
                lines[j] = lines[j].replace('})', '}).replace("'broker_name': '',", "'broker_name': '',\n" + indent + "'profile_picture': profile_pic,")
                break
        break

# Do the same for agents
in_agents = False
for i, line in enumerate(lines):
    if '# Add agents' in line:
        in_agents = True
    if in_agents and 'result.append({' in line:
        for j in range(i, min(i+20, len(lines))):
            if '})' in lines[j]:
                indent = '                '
                # Add profile_pic variable
                for k in range(i, 0, -1):
                    if 'for agent in agents:' in lines[k]:
                        indent2 = '            '
                        pic_lines = [
                            indent2 + '# Get profile picture URL\n',
                            indent2 + 'profile_pic = ""\n',
                            indent2 + 'if agent.profile_picture:\n',
                            indent2 + '    try:\n',
                            indent2 + "        profile_pic = agent.profile_picture.url\n",
                            indent2 + '    except:\n',
                            indent2 + "        profile_pic = ''\n",
                        ]
                        lines[k+1:k+1] = pic_lines + lines[k+1:]
                        break
                lines[j] = lines[j].replace('})', '}).replace("'broker_name': broker_name,", "'broker_name': broker_name,\n" + indent + "'profile_picture': profile_pic,")
                break
        break

with open('users/views.py', 'w') as f:
    f.writelines(lines)

print("Profile pictures added")
