public class TestSimple {
    public static void main(String[] args) {
        int numero = 10;
        double precio = 25.99;
        String mensaje = "Hola Mundo";
        boolean activo = true;
        
        System.out.println(mensaje);
        System.out.println("Número: " + numero);
        System.out.println("Precio: " + precio);
        
        if (numero > 5) {
            System.out.println("El número es mayor a 5");
        } else {
            System.out.println("El número es menor o igual a 5");
        }
        
        for (int i = 0; i < 3; i++) {
            System.out.println("Iteración: " + i);
        }
        
        while (activo) {
            System.out.println("Ejecutando while");
            activo = false;
        }
    }
}