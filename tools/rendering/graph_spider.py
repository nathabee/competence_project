import matplotlib.pyplot as plt
import numpy as np
from matplotlib.offsetbox import OffsetImage, AnnotationBbox
import matplotlib.image as mpimg

# Data for the left chart
labels_left = [
    'Reconnaitre lettre', 
    'Tenir crayon', 
    'Repeter phrase', 
    'Reconnaitre syllable', 
    'Tirer des traits'
]
values_left = [1.87, 2.25, 2.33, 3.00, 2.50]

# Data for the right chart
labels_right = [
    'Comparer des nombres', 
    'Écrire des nombres (sous la dictée)', 
    'Placer un nombre sur une ligne graduée', 
    'Résoudre des problèmes', 
    'Additionner (Calculer en ligne)', 
    'Soustraire (Calculer en ligne)'
]
values_right = [1.17, 1.25, 2.33, 3.00, 3.50, 3.50]

# Function to create radar chart
def create_radar_chart(ax, labels, values, color):
    num_vars = len(labels)
    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    values += values[:1]
    angles += angles[:1]
    
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)
    
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(labels, fontsize=10)
    ax.plot(angles, values, linewidth=2, linestyle='solid', color=color)
    ax.fill(angles, values, color=color, alpha=0.3)
    ax.set_ylim(0, 4)

# Create a figure with two subplots for the radar charts
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 7), subplot_kw=dict(polar=True))

# Create the left radar chart (blue)
create_radar_chart(ax1, labels_left, values_left, 'blue')

# Create the right radar chart (orange)
create_radar_chart(ax2, labels_right, values_right, 'orange')

# Add the top text (Name, Class, Date)
fig.suptitle("Claire Vassal - Classe: GS - Date: 20 septembre 2024", fontsize=16, fontweight='bold')

# Add two logos in the center (load your logo files here)
logo1_path = 'logo10.png'  # Replace with the actual path to logo1
logo2_path = 'logo12.png'  # Replace with the actual path to logo2

try:
    # Load logo1 and add to the center
    logo1 = mpimg.imread(logo1_path)
    imagebox1 = OffsetImage(logo1, zoom=0.6)  # Increase zoom (3x bigger than before)
    ab1 = AnnotationBbox(imagebox1, (0.20, 0.45), xycoords='figure fraction', frameon=False)  # Center position
    fig.add_artist(ab1)

    # Load logo2 and add to the center, slightly below logo1
    logo2 = mpimg.imread(logo2_path)
    imagebox2 = OffsetImage(logo2, zoom=0.6)  # Increase zoom (3x bigger than before)
    ab2 = AnnotationBbox(imagebox2, (0.65, 0.45), xycoords='figure fraction', frameon=False)  # Adjust position
    fig.add_artist(ab2)

except FileNotFoundError:
    print("One or both logo files not found. Make sure 'logo1.png' and 'logo2.png' are in the correct path.")

# Adjust layout and show the plot
plt.tight_layout(rect=[0, 0, 1, 0.95])
plt.show()