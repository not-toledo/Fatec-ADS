#include <iostream>
using namespace std;
int main()
{
    float nota, soma=0, mediafinal;
    
    for (int i=1; i<=4; i++)
    {
    cout << "\n insira a nota da p" << i << ": ";
    cin >> nota;
    
    soma = soma + nota;
    }

    mediafinal = soma / 4;
    
    cout << "\n a media final da nota é: " << mediafinal;

    return 0;

}
