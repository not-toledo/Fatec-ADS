#include <iostream>
using namespace std;

int main(){

    char letra;

    cout << "me diga uma letra\n";
    cin >> letra;

    if (letra == 'a' || letra == 'e' || letra == 'i' ||
    letra == 'o' || letra == 'u' || letra == 'A' || letra == 'E' || letra == 'I' ||
    letra == 'O' || letra == 'U') {
    cout << "A letra eh vogal" << endl;
    } else {
    cout << "A letra eh consoante" << endl;
    }   
    
    return 0;

}