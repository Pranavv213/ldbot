import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import schedule from 'node-schedule';
import date from 'date-and-time';
import express from 'express';
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
const userCollection = collection(db, "user");
import cron from 'node-cron';





//7214138008:AAFoTXgfsEQL5AUmxlEbLQZLRP4BwuxEZMY



const token = '7262080899:AAEkZL2gJXRGYQL_PCZfPbsTrDODCCmui8g';



// Token and chat ID


// Environment check
const isProduction = false;

// Bot initialization
let bot;
if (isProduction) {
  bot = new TelegramBot(token);
  bot.setWebHook(`https://routerldbot.finelogics.com/bot${token}`);
} else {
  bot = new TelegramBot(token, { polling: true });
}

// Express server
const app = express();
const port = process.env.PORT || 8001;

// Webhook endpoint
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.send('Bot is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




const runAtMidnight = async() => {

 
try {

  const data = await getDocs(userCollection)

  let users=await data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

  const uniqueArray = Array.from(
    new Map(users.map(item => [item.chatId, item])).values()
);

  const now = new Date();
  
  const time=date.format(now, 'MMM DD YYYY');


  //bybit
  const res_bybit1=await axios('http://34.93.102.172:8000/bybitdata')
  const res_bybit2=await axios('http://34.93.102.172:8000/bybitdepth')
  const volume_bybit=parseFloat(res_bybit1.data.result.list[0].turnover24h).toFixed(2)
  const spread_bybit=parseFloat(res_bybit1.data.result.list[0].ask1Price-res_bybit1.data.result.list[0].bid1Price).toFixed(3)
  const depth_bybit=res_bybit2.data

  //kucoin
  const res_kucoin1=await axios('http://34.93.102.172:8000/kucoindata?token=route')
  const res_kucoin2=await axios('http://34.93.102.172:8000/kucoindepth?token=route')
  const volume_kucoin=parseFloat(res_kucoin1.data.data.volValue).toFixed(2)
  const spread_kucoin=parseFloat(res_kucoin1.data.data.sell-res_kucoin1.data.data.buy).toFixed(3)
  const depth_kucoin=res_kucoin2.data

  //Mexc
  const res_mexc1=await axios('http://34.93.102.172:8000/mexcdata?token=route')
  const res_mexc2=await axios('http://34.93.102.172:8000/mexcdepth?token=route')
  const volume_mexc=parseFloat(res_mexc1.data.volume).toFixed(2)
  const spread_mexc=parseFloat(res_mexc1.data.askPrice-res_mexc1.data.bidPrice).toFixed(3)
  const depth_mexc=res_mexc2.data

  //gate
  const res_gate1=await axios('http://34.93.102.172:8000/gatedata?token=route')
  const res_gate2=await axios('http://34.93.102.172:8000/gatedepth?token=route')
  const volume_gate=parseFloat(res_gate1.data[0].quote_volume).toFixed(2)
  const spread_gate=parseFloat(res_gate1.data[0].lowest_ask-res_gate1.data[0].highest_bid).toFixed(3)
  const depth_gate=res_gate2.data

  //ascendex
  const res_asd1=await axios('http://34.93.102.172:8000/asddata')
  const res_asd2=await axios('http://34.93.102.172:8000/asddepth')
  const volume_asd=parseFloat(res_asd1.data.data.volume).toFixed(2)
  const spread_asd=parseFloat(res_asd1.data.data.ask[0]-res_asd1.data.data.bid[0]).toFixed(3)
  const depth_asd=res_asd2.data

  //htx
  const res_htx1=await axios('http://34.93.102.172:8000/htxdata')
  const res_htx2=await axios('http://34.93.102.172:8000/htxdepth')
  const volume_htx=parseFloat(res_htx1.data.tick.vol).toFixed(2)
  const spread_htx=parseFloat(res_kucoin1.data.data.volValue).toFixed(3)
  const depth_htx=res_htx2.data

  for(let i=0;i<uniqueArray.length;i++)
    {
      let chatId=uniqueArray[i].chatId
  
      bot.sendMessage(chatId,`[${time}]`)
  
      bot.sendMessage(chatId, `
              [24H VOLUME]
         
           Bybit: ${volume_bybit}
           Kucoin: ${volume_kucoin}
           Mexc: ${volume_mexc}
           Gate: ${volume_gate}
           Ascendex: ${volume_asd}
           Houbli: ${volume_htx}
           
           `);
      bot.sendMessage(chatId, `
            [SPREAD]
       
         Bybit: ${spread_bybit}
         Kucoin: ${spread_kucoin}
         Mexc: ${spread_mexc}
         Gate: ${spread_gate}
         Ascendex: ${spread_asd}
         Houbli: ${spread_htx}
         
         `);
       bot.sendMessage(chatId, `
          [DEPTH]
     
       Bybit
       0.3%:  ${parseFloat(depth_bybit["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_bybit["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_bybit["1%"]).toFixed(2)}
    
       Kucoin: 
       0.3%:  ${parseFloat(depth_kucoin["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_kucoin["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_kucoin["1%"]).toFixed(2)}
    
       Mexc:
       0.3%:  ${parseFloat(depth_mexc["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_mexc["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_mexc["1%"]).toFixed(2)}
    
       Gate: 
       0.3%:  ${parseFloat(depth_gate["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_gate["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_gate["1%"]).toFixed(2)}
    
       Ascendex: 
       0.3%:  ${parseFloat(depth_asd["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_asd["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_asd["1%"]).toFixed(2)}
    
    
       
       `);
     
    }

 

} catch (error) {
  bot.sendMessage(chatId, 'Sorry, I could not fetch the data at the moment.');
  console.error(error);
}


 
};



cron.schedule('55 23 * * *', runAtMidnight);


// setInterval(runAtMidnight,3000)





bot.onText(/\/start/,async (msg) =>{

  const chatId = msg.chat.id;

  console.log(typeof(chatId))

  await addDoc(userCollection,{chatId:chatId});

  bot.sendMessage(chatId, `
      
   Subscribed to receive updates at 12 am everyday

   /getdata to receive the current data

    
    `);

})



  bot.onText(/\/getdata/, async (msg) => {

    const chatId = msg.chat.id;

    try {

      //bybit
      const res_bybit1=await axios('http://34.93.102.172:8000/bybitdata')
      const res_bybit2=await axios('http://34.93.102.172:8000/bybitdepth')
      const volume_bybit=parseFloat(res_bybit1.data.result.list[0].turnover24h).toFixed(2)
      const spread_bybit=parseFloat(res_bybit1.data.result.list[0].ask1Price-res_bybit1.data.result.list[0].bid1Price).toFixed(3)
      const depth_bybit=res_bybit2.data

      //kucoin
      const res_kucoin1=await axios('http://34.93.102.172:8000/kucoindata?token=route')
      const res_kucoin2=await axios('http://34.93.102.172:8000/kucoindepth?token=route')
      const volume_kucoin=parseFloat(res_kucoin1.data.data.volValue).toFixed(2)
      const spread_kucoin=parseFloat(res_kucoin1.data.data.sell-res_kucoin1.data.data.buy).toFixed(3)
      const depth_kucoin=res_kucoin2.data

      //Mexc
      const res_mexc1=await axios('http://34.93.102.172:8000/mexcdata?token=route')
      const res_mexc2=await axios('http://34.93.102.172:8000/mexcdepth?token=route')
      const volume_mexc=parseFloat(res_mexc1.data.volume).toFixed(2)
      const spread_mexc=parseFloat(res_mexc1.data.askPrice-res_mexc1.data.bidPrice).toFixed(3)
      const depth_mexc=res_mexc2.data

      //gate
      const res_gate1=await axios('http://34.93.102.172:8000/gatedata?token=route')
      const res_gate2=await axios('http://34.93.102.172:8000/gatedepth?token=route')
      const volume_gate=parseFloat(res_gate1.data[0].quote_volume).toFixed(2)
      const spread_gate=parseFloat(res_gate1.data[0].lowest_ask-res_gate1.data[0].highest_bid).toFixed(3)
      const depth_gate=res_gate2.data

      //ascendex
      const res_asd1=await axios('http://34.93.102.172:8000/asddata')
      const res_asd2=await axios('http://34.93.102.172:8000/asddepth')
      const volume_asd=parseFloat(res_asd1.data.data.volume).toFixed(2)
      const spread_asd=parseFloat(res_asd1.data.data.ask[0]-res_asd1.data.data.bid[0]).toFixed(3)
      const depth_asd=res_asd2.data

      //htx
      const res_htx1=await axios('http://34.93.102.172:8000/htxdata')
      const res_htx2=await axios('http://34.93.102.172:8000/htxdepth')
      const volume_htx=parseFloat(res_htx1.data.tick.vol).toFixed(2)
      const spread_htx=parseFloat(res_kucoin1.data.data.volValue).toFixed(3)
      const depth_htx=res_htx2.data


      bot.sendMessage(chatId, `
              [24H VOLUME]
         
           Bybit: ${volume_bybit}
           Kucoin: ${volume_kucoin}
           Mexc: ${volume_mexc}
           Gate: ${volume_gate}
           Ascendex: ${volume_asd}
           Houbli: ${volume_htx}
           
           `);
           bot.sendMessage(chatId, `
            [SPREAD]
       
         Bybit: ${spread_bybit}
         Kucoin: ${spread_kucoin}
         Mexc: ${spread_mexc}
         Gate: ${spread_gate}
         Ascendex: ${spread_asd}
         Houbli: ${spread_htx}
         
         `);
         bot.sendMessage(chatId, `
          [DEPTH]
     
       Bybit
       0.3%:  ${parseFloat(depth_bybit["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_bybit["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_bybit["1%"]).toFixed(2)}

       Kucoin: 
       0.3%:  ${parseFloat(depth_kucoin["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_kucoin["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_kucoin["1%"]).toFixed(2)}

       Mexc:
       0.3%:  ${parseFloat(depth_mexc["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_mexc["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_mexc["1%"]).toFixed(2)}

       Gate: 
       0.3%:  ${parseFloat(depth_gate["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_gate["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_gate["1%"]).toFixed(2)}

       Ascendex: 
       0.3%:  ${parseFloat(depth_asd["0.3%"]).toFixed(2)}
       0.5%:  ${parseFloat(depth_asd["0.5%"]).toFixed(2)}
       1%:  ${parseFloat(depth_asd["1%"]).toFixed(2)}

   
       
       `);

     

    } catch (error) {
      bot.sendMessage(chatId, 'Sorry, I could not fetch the data at the moment.');
      console.error(error);
    }
  });

console.log('Bot is running...');