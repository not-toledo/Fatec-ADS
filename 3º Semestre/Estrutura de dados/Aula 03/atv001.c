#include <stdio.h>

void tabuada(int numero) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", numero * i);
    }
}

int cubo(int numero) {
    return numero * numero * numero;
}

int main() {
    int num;
    printf("Digite um número: ");
    scanf("%d", &num);
    
    tabuada(num);
    
    printf("Digite um número: ");
    scanf("%d", &num);
    
    int resultado = cubo(num);
    
    printf("O cubo de é: %d\n", resultado);
    
}
    