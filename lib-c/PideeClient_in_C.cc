#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>

#include <unistd.h>
#include <fcntl.h>
#include <string.h>
#include <signal.h>


// #define SOCK_PATH "/tmp/nono.sock"
#define SOCK_PATH "/tmp/pidee.sock"

int socket_fd;
unsigned int token = 129123;
bool listenToInput = false;


// predefining methods.

void signalHandler(int sig);
void createSocket();
void connectSocket();
void sendMessage( char* str );
bool processArguments( int argc, char *argv[] );
bool listenLoop();
bool inputLoop();


/*
*   Signal Handler
*   This catches all kinds of signals and closes the application
*/
void signalHandler(int sig){
    usleep(100000);         // wait for everything to do its last bits
    if( socket_fd != -1 ) close( socket_fd );   // close the socket connection
    printf("Client closed... (%i)\n",sig);      // say byebye
    exit(0);
}

/*
*   Create the socket
*   Its a unix socket so its AF_UNIX
*/
void createSocket(){
    if ((socket_fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
        perror("socket");
        exit(1);
    }    
}

/*
*   Connect to the socket
*/
void connectSocket(){
    printf("Connecting to socket <%s>...",SOCK_PATH);

    struct sockaddr_un remote;
    remote.sun_family = AF_UNIX;
    strcpy(remote.sun_path, SOCK_PATH);
    int len = strlen(remote.sun_path) + sizeof(remote.sun_family);
    if (connect(socket_fd, (struct sockaddr *)&remote, len) == -1) {
        perror("connect");
        exit(1);
    }

    printf(" connected.\n");    
}

/*
*   Send a message
*   Adding a token and a endline to the string.
*/
void sendMessage( char* str ){

    char sendStr[100];
    sprintf(sendStr,"#%08u %s\n",token,str);
    if (send(socket_fd, sendStr, strlen(sendStr), 0) == -1) {
        perror("send");
        exit(1);
    }
    usleep(100000); 
    token++;
}

/*
*   Reading the aruments that came with the start command.
*/
bool processArguments( int argc, char *argv[] ){
    if( argc > 1 ){
        printf("ARGUMENTS [%i]\n",argc);
        char argsStr[100];
        memset(argsStr, '\0', 100);
        // argsStr[100] = '\0';
        for (int n = 1; n < argc; n++){
            printf(" ARG[%i] >>  %s\n",n,argv[ n ]);
            sprintf(argsStr,"%s%s ",argsStr,argv[ n ]);
        }
        sendMessage( argsStr );

        // wait for return messages
        usleep(100000);
        // and listen...
        listenLoop();

        return false;
    }
    return true;    
}

/*
*   
*/
bool listenLoop(){

    bool hadInput = false;
    char str[100];
    int t;
    if ((t=recv(socket_fd, str, 100, 0)) > 0) {
        str[t] = '\0';
        printf("%s", str);
        hadInput = true;
    } else {
        if (t < 0) perror("recv");
        else printf("Server closed connection\n");
        exit(1);
    }
    if( hadInput ) printf("\n");
    return hadInput;
}



bool inputLoop(){

    char str[100];
    while(printf("> "), fgets(str, 100, stdin), !feof(stdin)) {
        // if( strlen(str) == 0 ) return false;
        str[ strlen(str) -1 ] = '\0';
        sendMessage( str );
        return true;
    }  
    return false;  
}

int main(int argc, char *argv[])
{

    char str[100];

// Signal handler
    struct sigaction act;
    act.sa_handler = signalHandler;
    sigemptyset(&act.sa_mask);
    act.sa_flags = 0;
    sigaction(SIGINT, &act, 0);


    createSocket();
    connectSocket();

    listenToInput = processArguments(argc, argv );


    if( listenToInput ){
        sprintf(str,"led.yellow SET 1 ");
        sendMessage( str );
        usleep(300000); 
        sprintf(str,"led.yellow SET 0");
        sendMessage( str );
    }
    // usleep(100000); 


    sprintf(str,"all SUBSCRIBE");
    sendMessage( str );

    while( listenToInput ) {

        listenLoop();       // listen to the latest input via the socket
        usleep(100000);     // wait for a mini while

        // inputLoop();        // wait for input ending with a return
        // usleep(500000);     // wait for a while to make sure all receiving messages arrived

    }

    signalHandler(0);       // ending the application

    return 0;
}