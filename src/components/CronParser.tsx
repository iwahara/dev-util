import React, { useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { Button } from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import { formatISO } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'


import {
    ListItem,
    UnorderedList,
  } from '@chakra-ui/react'

import { Input } from '@chakra-ui/react'

  import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react'

function CronParser(){
    const dummy :string[] = [];
    const defaultCron = "* * * * *";
    const defaultCount = 5;
    const [nextList, setNextList] = useState(dummy);
    const [targetDate, setTargetDate] = useState(new Date());
    const [cron, setCron] = useState(defaultCron);
    const [count, setCount] = useState(defaultCount)

    function commandCronFormatter(){
        const jstDate = utcToZonedTime(targetDate, 'Asia/Tokyo')
        console.log(formatISO(jstDate));
        invoke<string[]>('command_cron_formatter',{msg:{cron:cron, now:formatISO(jstDate),count:count}}).then(message => {
            setNextList(message);
        }).catch(message => {
            console.error('command_cron_formatter', message);
        })
    }

    return (
        <div>
            <Input colorScheme='blue' defaultValue={defaultCron} onChange={(event) => setCron(event.target.value)}>
            </Input>
            <NumberInput defaultValue={defaultCount} min={1} max={100} value={count} onChange={(_valueString,valueAsNumber) => setCount(valueAsNumber)} >
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
            <DateTimePicker onChange={setTargetDate} value={targetDate} disableClock={true} />
            <Button onClick={commandCronFormatter} colorScheme='blue'>パースする</Button>
            <div>
                <UnorderedList colorScheme='blue'>
                    {nextList.map((next:string,i:number) => {
                    return <ListItem key={next}>{new Date(next).toLocaleString()}</ListItem>
                })}
                </UnorderedList>
            </div>
        </div>
    );
    
}
export default CronParser;