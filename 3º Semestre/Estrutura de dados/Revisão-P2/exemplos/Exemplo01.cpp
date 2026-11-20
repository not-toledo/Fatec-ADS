#include <stdio.h>
#include <iostream>
using namespace std;
int tamanho, mt[40][40], x=1, y=1;


void criaGrafo()
{
cout <<"Insira o tamanho do grafo: ";
cin >>tamanho;
for (y=1;y<=tamanho;y++)
{
    for (x=1;x<=tamanho;x++)
    {
       cout<<"Insira o valor para a aresta " << y  << " e " << x << " ";
       cin >> mt[y][x];
    }

}

}

void exibeGrafo()
{
    for (y=1;y<=tamanho;y++)
{
    for (x=1;x<=tamanho;x++)
    {
       cout<<" " << mt[y][x] << " ";
    }
  cout<<"\n";
}

}


void contaArestas()
{
    int cont=0;
    for (y=1;y<=tamanho;y++)
{
    for (x=1;x<=tamanho;x++)
    {
     //conta quando x e y fizerem interseccao
       if (mt[y][x]==1 && mt[x][y]==1 && x != y)
       {
           cont++;
       }

    }
}

//passara no looping duas vezes
cont = cont/2;


//se x e y forem iguais o ha um vertice ligado a ele mesmo
for (x=1;x<=tamanho;x++)
    {
        cout << mt[x][x] << "\n";
       if (mt[x][x] == 1)
       {
           cont++;
       }

    }


cout<<"Arestas " << cont <<"\n";
}



int main()
{

criaGrafo();
exibeGrafo();
contaArestas();
system("pause");
return 0;

}
