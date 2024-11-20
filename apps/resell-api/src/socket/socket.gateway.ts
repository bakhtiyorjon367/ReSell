import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import { Member } from '../libs/dto/member/member';
import * as url from 'url';

interface MessagePayload {
  event: string;
  text:string;
  memberData:Member;
}

interface InfoPayload {
  event: string;
  totalClients: number;
  memberData:Member;
  action:string;
}

@WebSocketGateway({transports: ['websocket'], secure:false})
export class SocketGateway implements OnGatewayInit{
  private logger:Logger = new Logger('SocketEventsGateway');
  private summaryClient:number = 0;
  private clientAuthMap = new Map<WebSocket, Member>();
  private messagesList: MessagePayload[]= [];

  constructor( private authService:AuthService){}

  @WebSocketServer()
  server: Server;

  public afterInit(server: Server){
    this.logger.verbose(`WebSocket Server Initilized & total: [${this.summaryClient}]`)
  };/*_________________________________________________________________________________________________*/
  
  private async retrieveAuth(req:any): Promise<Member>{
    try{
      const parseUrl = url.parse(req.url, true);
      const {token} = parseUrl.query;
      return await this.authService.verifyToken(token as string)
    }catch(err){
      return null;
    }
  };/*_________________________________________________________________________________________________*/

  public async handleConnection(client:WebSocket, req:any){
    const authMember = await this.retrieveAuth(req);
    this.summaryClient++;
    this.clientAuthMap.set(client, authMember);

    const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`Connection [${clientNick}] &  total: [${this.summaryClient}]`);

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'joined'
    };
    this.emitMessage(infoMsg);
    //CLIENT MESSAGES
    client.send(JSON.stringify({event:"getMessages", list: this.messagesList}));
  };/*_________________________________________________________________________________________________*/

  handleDisconnect(client:WebSocket){
    const authMember = this.clientAuthMap.get(client);
    this.summaryClient--;
    this.clientAuthMap.delete(client);
   
    const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`Disconnected [${clientNick}]& total: [${this.summaryClient}]`);

    const infoMsg: InfoPayload = {
      event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action: 'left'
    };

    this.broadcastMessage(client, infoMsg);
  };/*_________________________________________________________________________________________________*/

  @SubscribeMessage('message')
  public async handleMessage(client: WebSocket, payload: string): Promise<void> {
    const authMember = this.clientAuthMap.get(client);
    const newMessage: MessagePayload = {event: 'message', text:payload, memberData:authMember};

    const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${payload}`);

    this.messagesList.push(newMessage);
    if(this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5);

    this.emitMessage(newMessage);
  };/*_________________________________________________________________________________________________*/

  private broadcastMessage(sender: WebSocket,message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client)=>{
      if(client !== sender && client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(message));
      }
    })
  };/*_________________________________________________________________________________________________*/

  private emitMessage(message:InfoPayload | MessagePayload) {
    this.server.clients.forEach((client)=>{
      if(client.readyState === WebSocket.OPEN){
        client.send(JSON.stringify(message));
      }
    })
  };/*_________________________________________________________________________________________________*/
}


/**
 * MESSAGE TAERGET: 
 * 1. CLIENT (only client)
 * 2. BROADCAST (except client)
 * 3. EMIT  (all client)
 */