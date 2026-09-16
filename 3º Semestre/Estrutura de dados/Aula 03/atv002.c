#include <stdio.h>
#include <stdlib.h>

void calcularMedia(float p1, float p2, float atv, float *media)
{
    *media = p1 * 0.35 + p2 * 0.35 + atv;

    printf("\nA media eh: %.2f", *media);
}

void verificarResultado(float media)
{
    if (media >= 6)
    {
        printf("\nVoce foi aprovado com media: %.2f", media);
    }
    else
    {
        printf("\nVoce foi reprovado!");
    }
}

int main()
{
    float p1, p2, atv, media;

    printf("\nInforme a nota da P1: ");
    scanf("%f", &p1);

    printf("\nInforme a nota da P2: ");
    scanf("%f", &p2);

    printf("\nInforme a pontuacao das atividades: ");
    scanf("%f", &atv);

    calcularMedia(p1, p2, atv, &media);

    verificarResultado(media);

    system("pause");
    return 0;
}
