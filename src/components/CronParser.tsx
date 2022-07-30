import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';

import {
    ListItem,
    UnorderedList,
  } from '@chakra-ui/react'

  import {
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
  } from '@chakra-ui/react'

function CronParser(){
    const dummy :string[] = [];
    const defaultCron = "* * * * *";
    const [nextList, setNextList] = useState(dummy);
    const [targetDate, setTargetDate] = useState(new Date());
    const [cron, setCron] = useState(defaultCron);

    function commandCronFormatter(){
        const now = new Date(targetDate.toLocaleString());
        console.log(cron);
        invoke<string[]>('command_cron_formatter',{msg:{cron:cron, now:now.toISOString(),count:5}}).then(message => {
            setNextList(message);
        }).catch(message => {
            console.error('command_cron_formatter', message);
        })
    }

    return (
        <div>
            <Editable colorScheme='blue' defaultValue={defaultCron} onChange={setCron}>
                <EditablePreview />
                <EditableInput />
            </Editable>
            <DateTimePicker onChange={setTargetDate} value={targetDate} disableClock={true} />
            <Button onClick={commandCronFormatter} colorScheme='blue'>Click to execute simpleCommands</Button>
            <div>
                <UnorderedList colorScheme='blue'>
                    {nextList.map((next,i) => {
                    return <ListItem>{next}</ListItem>
                })}
                </UnorderedList>
            </div>
        </div>
    );
    
}
export default CronParser;